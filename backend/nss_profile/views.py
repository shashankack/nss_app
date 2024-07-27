from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from .models import Volunteer, User, NSSYear
from .serializers import *
from rest_framework.permissions import IsAuthenticated
from .permissions import *
from nss_events.models import Attendance, Events
from nss_events.views import EventsAttendedAPIView
#APIViews to handle Volunteers


class LoggedInUserAPIView(APIView):
    def get_college(self, user_id, volunteering_year):
        return Volunteer.objects.get(user_id=user_id, volunteering_year=volunteering_year).course.college

    def get(self, request):
        self.permission_classes = [IsAuthenticated]
        self.check_permissions(request)
        admin = CollegeAdmin.objects.filter(id=request.user.id).first()
        if admin:
            serializer = CollegeAdminSerializer(admin)
            values = serializer.data
            values['role'] = 'Admin'
            values['blood_group'] = request.user.blood_group
            values['gender'] = request.user.gender
        else:
            volunteering_year = NSSYear.current_year()
            college = self.get_college(request.user.id, volunteering_year)
            volunteer = Volunteer.objects.get(user_id=request.user.id)
            serializer = VolunteerSerializer(volunteer)
            values = serializer.data
            credits = Attendance.objects.filter(volunteer__user_id=request.user.id,
                                                volunteer__role=volunteer.role,
                                                volunteer__volunteering_year=NSSYear.current_year(),
                                                ).select_related('event').values_list('event__credit_points', flat=True)
            total_events = Events.objects.filter(status__in=[Events.STATUS_ONGOING, Events.STATUS_COMPLETED], volunteering_year=NSSYear.current_year(), college=college)
            attended_events = Attendance.objects.filter(volunteer__user_id=request.user.id, event__in=total_events).count()
            total_events = total_events.count()
            if total_events and attended_events:
                values['attendance_percentage'] = (attended_events/total_events) * 100
            else:
                values['attendance_percentage'] = 0
            values['credits_earned'] = sum(list(credits))
        return Response(values, status=status.HTTP_200_OK)
    
class VolunteerAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get_admin_college(self, user_id):
        try:
            return CollegeAdmin.objects.get(user_id=user_id).college
        except CollegeAdmin.DoesNotExist:
            return None

    def get_college(self, user_id, volunteering_year):
        return Volunteer.objects.filter(user_id=user_id, volunteering_year=volunteering_year).first()

    def get(self, request):
        college = self.get_admin_college(request.user.id)
        if not college:
            college = self.get_college(request.user.id, volunteering_year)
            
        event_id = request.GET.get('event_id')
        volunteering_year = NSSYear.current_year()
        attended_volunteers = Attendance.objects.filter(event_id=event_id).values_list('volunteer_id', flat=True)
        volunteers = Volunteer.objects.filter(course__college=college.id).exclude(id__in=attended_volunteers)
        serializer = VolunteerSerializer(volunteers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UploadVolunteersAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def get_admins_college(self, user_id):
        try:
            return CollegeAdmin.objects.get(user_id=user_id).college
        except CollegeAdmin.DoesNotExist:
            return None

    def post(self, request):
        volunteering_year = NSSYear.current_year()
        college = self.get_admins_college(request.user.id)
        data_list = request.data # Assuming 'users' is the key for the array of volunteer data

        if data_list is None or not isinstance(data_list, list):
            return Response("A list of user data is required", status=status.HTTP_400_BAD_REQUEST)

        created_volunteers = []
        errors = []

        for user_data in data_list:
            user = None
            user_object = user_data.get("user")
            if isinstance(user_object, dict):
                username = user_object.get('username')
                user = User.objects.filter(username=username).first()
                if not user:
                    user_object['password'] = 'pleaserestme'
                    serializer = UserSerializer(data=user_object)
                    if serializer.is_valid():
                        user = serializer.save()
                    else:
                        errors.append({"user_data": user_data, "errors": serializer.errors})
                        continue

            elif isinstance(user_object, int):
                user = User.objects.filter(pk=user_object).first()
                if not user:
                    errors.append({"user_data": user_data, "errors": "User does not exist"})
                    continue

            vol = Volunteer.objects.filter(user=user, volunteering_year=volunteering_year).first()
            if vol:
                user_ = vol.user
                user_.is_active=True
                user_.save()
                errors.append({"user_data": user_data, "errors": "This volunteer already has a profile with the same volunteering year"})
                continue

            if not user:
                errors.append({"user_data": user_data, "errors": "User does not exist"})
                continue

            user_data['user'] = user.id
            user_data['volunteering_year'] = volunteering_year.id
            serializer = VolunteerCreateSerializer(data=user_data)
            if serializer.is_valid():
                serializer.save()
                created_volunteers.append(serializer.data)
            else:
                errors.append({"user_data": user_data, "errors": serializer.errors})

        if errors:
            return Response({"created_volunteers": [volunteer for volunteer in created_volunteers], "errors": errors}, status=status.HTTP_200_OK)

        return Response({"created_volunteers": [volunteer for volunteer in created_volunteers]}, status=status.HTTP_200_OK)

class ResetPasswordAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        user = request.user
        data = request.data
        password = data.get('password')
        if not password:
            return Response("Password is required", status=status.HTTP_400_BAD_REQUEST)
        user.set_password(password)
        user.save()
        return Response("Password has been reset", status=status.HTTP_200_OK)

class ManageVolunteerAPIView(APIView): #College Admin
    permission_classes = [IsAuthenticated]    
    def get_admins_college(self, user_id):
        try:
            return CollegeAdmin.objects.get(user_id=user_id).college
        except CollegeAdmin.DoesNotExist:
            return None

    def get(self, request, volunteer_id = None):
        college = self.get_admins_college(request.user.id)
        admin = CollegeAdmin.objects.filter(user = request.user.id).exists()
        if not admin:
            return Response('You are not authorized to view this content', status=status.HTTP_403_FORBIDDEN)

        if volunteer_id is not None:
            volunteer = Volunteer.objects.filter(pk=volunteer_id, course__college=college).first()
            
            if volunteer:
                if volunteer.user.is_active:
                    serializer = VolunteerSerializer(volunteer)
                    return Response(serializer.data, status=status.HTTP_200_OK)
                else:
                    return Response("Volunteer does not exist", status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response("Volunteer does not exist", status=status.HTTP_404_NOT_FOUND)
        else:
            volunteers = Volunteer.objects.filter(course__college=college, user__is_active=True)
            serializer = VolunteerSerializer(volunteers, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)        

    def get_admins_college(self, user_id):
        try:
            return CollegeAdmin.objects.get(user_id=user_id).college
        except CollegeAdmin.DoesNotExist:
            return None
 
    def post(self, request):
        volunteering_year = NSSYear.current_year()  
        college = self.get_admins_college(request.user.id)
        data = request.data
        user_data = data.get('user')
        
        if user_data is None:
            return Response("User data is required", status=status.HTTP_400_BAD_REQUEST)
        
        if isinstance(user_data, dict):
            user = User.objects.filter(username=user_data['username']).first()
            if not user:
                serializer = UserSerializer(data=user_data)
                if serializer.is_valid():
                    user = serializer.save()
                else:
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                
        elif isinstance(user_data, int):
            user_id = user_data
            user = User.objects.filter(pk=user_id).first()
        vol = Volunteer.objects.filter(user=user, volunteering_year=volunteering_year).first()
        if vol:
            user_ = vol.user
            user_.is_active=True
            user_.save()
            return Response("This volunteer already has a profile with the same volunteering year", status=status.HTTP_400_BAD_REQUEST)

        if not user:
            return Response("User does not exist", status=status.HTTP_404_NOT_FOUND)
        data['user'] = user.id


        data['volunteering_year'] = volunteering_year.id
        serializer = VolunteerCreateSerializer(data=data)
        if serializer.is_valid():
            print('AAAAA', )
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, volunteer_id):

        college = self.get_admins_college(request.user.id)
        admin = CollegeAdmin.objects.filter(user = request.user.id).exists()
        if not admin:
            return Response('You are not authorized to perform this action', status=status.HTTP_403_FORBIDDEN)
        
        volunteer = Volunteer.objects.filter(pk=volunteer_id, course__college=college).first()
        if not volunteer:
            return Response("Volunteer not exist", status=status.HTTP_404_NOT_FOUND)
        volunteer.user.is_active = False
        volunteer.user.save()
        return Response("Volunteer has been deleted", status=status.HTTP_204_NO_CONTENT)
        

    def put(self, request, volunteer_id):
        volunteer = Volunteer.objects.filter(pk=volunteer_id).first()
        if not volunteer:
            return Response("Volunteer not exist", status=status.HTTP_404_NOT_FOUND)
        user = volunteer.user
        user.first_name = request.data['user']['first_name']
        user.last_name = request.data['user']['last_name']
        user.email = request.data['user']['email']
        user.blood_group = request.data['user']['blood_group']
        user.gender = request.data['user']['gender']
        user.save()
        
        volunteer.course_id = request.data['course']
        volunteer.role = request.data['role']
        volunteer.course_year = request.data['course_year']
        volunteer.save()
        
        return Response('Updated Successfully', status=status.HTTP_200_OK)

    
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
    permission_classes = [IsAuthenticated]
    def get_admins_college(self, user_id):
        try:
            return CollegeAdmin.objects.get(user_id=user_id).college
        except CollegeAdmin.DoesNotExist:
            return None
        
    def get(self, request):
        college = self.get_admins_college(request.user.id)
        courses = CollegeCourses.objects.filter(college=college)
        serializer = CollegeCoursesSerializer(courses, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

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
    