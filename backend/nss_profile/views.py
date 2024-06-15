from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from .models import VolunteerProfile, User
from .serializers import *
from rest_framework.permissions import IsAuthenticated
from .permissions import *
from nss_events.models import Attendance
#APIViews to handle Volunteers


class LoggedInUserAPIView(APIView):
    def get(self, request):
        self.permission_classes = [IsAuthenticated]
        self.check_permissions(request)
        volunteer = VolunteerProfile.objects.filter(user_id=request.user.id).first()
        print(volunteer.user.first_name)
        serializer = VolunteerProfileSerializer(volunteer)
        values = serializer.data
        credits = Attendance.objects.filter(volunteer__user_id=2,
                                            volunteer__volunteering_year='2024-2025'
                                            ).select_related('event').values_list('event__credit_points', flat=True)
        values['credits_earned'] = sum(list(credits))
        return Response(values, status=status.HTTP_200_OK)
    

class VolunteerAPIView(APIView): #College Admin, Leader
    def get_admins_college(user_id):
        return CollegeAdmin.objects.get(user_id=user_id).college
    
    def get_leaders_college(user_id, volunteering_year):
        return VolunteerProfile.objects.get(user_id=user_id, role=VolunteerProfile.LEADER, volunteering_year=volunteering_year)
        

    def get(self, request, volunteer_id = None):
        self.permission_classes = [IsAuthenticated]
        college = self.get_users_college(request.user.id)

        if volunteer_id is not None:
            volunteer = VolunteerProfile.objects.filter(pk=volunteer_id, course_college=college).first()
            if volunteer:
                serializer = VolunteerProfileSerializer(volunteer)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response("Invalid id or volunteer does not exist", status=status.HTTP_404_NOT_FOUND)         
        else:
            volunteers = VolunteerProfile.objects.filter(course_college=college)
            serializer = VolunteerProfileSerializer(volunteers, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)        


    def post(self, request):
        self.permission_classes = [IsCollegeAdmin]
        self.check_permissions(request)
        data = request.data
        user_data = data.get('user')
        volunteering_year = data.get('volunteering_year')
    
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
            if VolunteerProfile.objects.filter(user=user, volunteering_year=volunteering_year):
                return Response("This volunteer already has a profile with the same volunteering year", status=status.HTTP_400_BAD_REQUEST)

            if not user:
                return Response("User does not exist", status=status.HTTP_404_NOT_FOUND)
            data['user'] = user.id
        else:
            return Response("Invalid data format", status=status.HTTP_400_BAD_REQUEST)
            
        serializer = VolunteerProfileSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response("Volunteer has been created", status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def delete(self, request, pk):
        self.permission_classes = [IsCollegeAdmin]
        self.check_permissions(request)
        volunteer = VolunteerProfile.objects.filter(pk=pk).first()
        if not volunteer:
            return Response("Volunteer does not exist", status=status.HTTP_404_NOT_FOUND)
        
        volunteer.delete()
        return Response("Volunteer deleted successfully", status=status.HTTP_204_NO_CONTENT)
    

    def put(self, request, pk):
        self.permission_classes = [IsCollegeAdmin] or [IsAuthenticated]
        self.check_permissions(request)
        volunteer = VolunteerProfile.objects.filter(pk=pk).first()
        if not volunteer:
            return Response("Volunteer not exist", status=status.HTTP_404_NOT_FOUND)
        
        serializer = VolunteerProfileSerializer(volunteer, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
 
    
class AdminVolunteerAPIView(VolunteerAPIView):
    pass

class LeaderVolunteerAPIView(VolunteerAPIView):
    pass


#APIVIew to handle Users

class UserAPIView(APIView):
    """ permission_classes = [IsCollegeAdmin]
    def get(self, request, pk = None):
        print('I am here...')
        if pk is not None:
            
            user = User.objects.filter(pk=pk).first()
            if user:
                serializer = UserSerializer(user)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response("User does not exist", status=status.HTTP_404_NOT_FOUND)
            
        else:
            users = User.objects.all()
            serializer = UserSerializer(users, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK) """
        
    def post(self, request):
        self.permission_classes = [IsCollegeAdmin | IsAdmin]
        self.check_permissions(request)
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response("New user has been created", status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, user_id):
        user = User.objects.filter(pk=user_id).first()
        if not user:
            return Response("User not found", status=status.HTTP_404_NOT_FOUND)
        
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response("User has been updated", status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    """ def delete(self, request, pk):
        user = User.objects.filter(pk=pk).first()
        if not user:
            return Response("User does not exist", status=status.HTTP_404_NOT_FOUND)
        
        user.delete()
        return Response("User deleted successfully", status=status.HTTP_204_NO_CONTENT) """
    
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
    
    