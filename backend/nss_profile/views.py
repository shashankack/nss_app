from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from .models import Volunteer, User, NSSYear
from .serializers import *
from rest_framework.permissions import IsAuthenticated
from .permissions import *
from nss_events.models import Attendance
#APIViews to handle Volunteers


class LoggedInUserAPIView(APIView):
    def get(self, request):
        self.permission_classes = [IsAuthenticated]
        self.check_permissions(request)
        """if user.is_admin:
            serializer = UserSerializer(user) """
        """ non_volunteer = User.objects.filter(id=request.user.id).first() """
        """ if non_volunteer:
            serializer = UserSerializer(data=request.data)
            if serializer.is_valid():
                return Response(serializer.data, status=status.HTTP_200_OK) """
        
        volunteer = Volunteer.objects.filter(user_id=request.user.id).first()
        print(volunteer.user.first_name)
        serializer = VolunteerSerializer(volunteer)
        values = serializer.data
        credits = Attendance.objects.filter(volunteer__user_id=request.user.id,
                                            volunteer__role=volunteer.role,
                                            volunteer__volunteering_year=NSSYear.current_year(),
                                            ).select_related('event').values_list('event__credit_points', flat=True)
        values['credits_earned'] = sum(list(credits))
        return Response(values, status=status.HTTP_200_OK)
        

class VolunteerAPIView(APIView): #College Admin, Leader
    permission_classes = [IsAuthenticated]
    #TODO: Validate collgee for admin in all methods

    def get_admins_college(self, user_id):
        return CollegeAdmin.objects.get(user_id=user_id).college
    
    def get_leaders_college(self, user_id, volunteering_year):
        return Volunteer.objects.get(user_id=user_id, role=Volunteer.LEADER, volunteering_year=volunteering_year)
        

    def get(self, request, volunteer_id = None):
        college = self.get_leaders_college(request.user.id)

        if volunteer_id is not None:
            volunteer = Volunteer.objects.filter(pk=volunteer_id, course_college=college).first()
            if volunteer:
                serializer = VolunteerSerializer(volunteer)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response("Invalid id or volunteer does not exist", status=status.HTTP_404_NOT_FOUND)         
        else:
            volunteers = Volunteer.objects.filter(course_college=college)
            serializer = VolunteerSerializer(volunteers, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)        


    def post(self, request):
        volunteering_year = NSSYear.current_year()
        college = self.get_leaders_college(request.user.id, volunteering_year)
        data = request.data
        #TODO check if the courser and admin callege combination is acceptable
        user_data = data.get('user')
        
        if user_data is None:
            return Response("User data is required", status=status.HTTP_400_BAD_REQUEST)

        if isinstance(user_data, dict):
            serializer = UserSerializer(data=user_data)
            if serializer.is_valid():
                user = serializer.save()
                data['user'] = user.id
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        elif isinstance(user_data, int):
            user_id = user_data
            user = User.objects.filter(pk=user_id).first()
            if Volunteer.objects.filter(user=user, volunteering_year=volunteering_year):
                return Response("This volunteer already has a profile with the same volunteering year", status=status.HTTP_400_BAD_REQUEST)

            if not user:
                return Response("User does not exist", status=status.HTTP_404_NOT_FOUND)
            data['user'] = user.id
        else:
            return Response("Invalid data format", status=status.HTTP_400_BAD_REQUEST)
            
        serializer = VolunteerSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response("Volunteer has been created", status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        volunteer = Volunteer.objects.filter(pk=pk).first()
        if not volunteer:
            return Response("Volunteer does not exist", status=status.HTTP_404_NOT_FOUND)
        
        volunteer.delete()
        return Response("Volunteer deleted successfully", status=status.HTTP_204_NO_CONTENT)

    def put(self, request, pk):
        volunteer = Volunteer.objects.filter(pk=pk).first()
        if not volunteer:
            return Response("Volunteer not exist", status=status.HTTP_404_NOT_FOUND)
        
        serializer = VolunteerSerializer(volunteer, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
class CollegeAPIView(APIView):
    permission_classes = [IsAdmin]
    def get(self, request):
        colleges = College.objects.all()
        serializer = CollegeSerializer(colleges, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        college_code = request.data.get('college_code')
        if College.objects.filter(college_code = college_code).exists():
            return Response("College with this code already exists!", status=status.HTTP_400_BAD_REQUEST)
        
        serializer = CollegeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response("College has been created", status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, college_id):
        college = College.objects.filter(id=college_id).first()
        if not college:
            return Response('College does not exist', status=status.HTTP_404_NOT_FOUND)
        college.delete()
        return Response("College deleted successfully", status=status.HTTP_204_NO_CONTENT)
    
    def put(self, request, college_id):
        college = College.objects.filter(id=college_id).first()
        if not college:
            return Response('College does not exist', status=status.HTTP_404_NOT_FOUND)
        serializer = CollegeSerializer(college, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response("College details has been updated", status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CoursesAPIView(APIView):
    def get(self, request, college_id, course_id=None):
        self.permission_classes = [IsAuthenticated]
        self.check_permissions(request)
        college = College.objects.filter(id=college_id).first()
        if college:
            if not course_id:
                return Response("No courses available", status=status.HTTP_404_NOT_FOUND)
        
            if course_id is None:   
                courses = CollegeCourses.objects.all()
                serializer = CollegeCoursesSerializer(courses, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            course = CollegeCourses.objects.filter(id=course_id).first()
            if not course:
                return Response("No courses available", status=status.HTTP_404_NOT_FOUND)
            serializer = CollegeCoursesSerializer(course)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response("College does not exist", status=status.HTTP_404_NOT_FOUND)      

    def post(self, request, college_id):
        self.permission_classes = [IsCollegeAdmin]
        self.check_permissions(request)
        request.coll
        data = request.data
        
        college = College.objects.get(pk=college_id)
        if not college:
            return Response("College does not exist", status=status.HTTP_404_NOT_FOUND)
        data['college'] = college.id
        serializer = CollegeCoursesSerializer(data=data)
        
        if serializer.is_valid():
            serializer.save()
            return Response("Course has been created", status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
       
    
    def delete(self, request, college_id):
        self.permission_classes = [IsCollegeAdmin]
        self.check_permissions()
        college = CollegeCourses.objects.filter(id=college_id).first()
        if not college:
            return Response('College does not exist', status=status.HTTP_404_NOT_FOUND)
        college.delete()
        return Response("College deleted successfully", status=status.HTTP_204_NO_CONTENT)
    
    def put(self, request, college_id):
        self.permission_classes = [IsCollegeAdmin]
        self.check_permissions()
        college = College.objects.filter(id=college_id).first()
        if not college:
            return Response('College does not exist', status=status.HTTP_404_NOT_FOUND)
        serializer = CollegeSerializer(college, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response("College has been created", status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CollegeAdminAPIView(APIView):
    permission_classes = [IsAdmin]
    def get(self, request):
        admins = CollegeAdmin.objects.all()
        serializer = CollegeAdminSerializer(admins, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = CollegeAdminSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response("New college admin has been created", status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request):
        data = request.data
        serializer = CollegeAdminSerializer(data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response("College admin has been updated", status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    