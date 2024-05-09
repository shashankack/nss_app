from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from .models import VolunteerProfile, User
from .serializers import VolunteerProfileSerializer, UserSerializer
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.hashers import make_password
from .permissions import IsCollegeAdmin, IsSuperUser


#APIViews to handle Volunteers

class VolunteerAPIView(APIView):

    permission_classes = [IsAuthenticated]
    def get(self, request, pk = None):
        
        if pk is not None:
            volunteer = VolunteerProfile.objects.filter(pk=pk).first()
            if volunteer:
                serializer = VolunteerProfileSerializer(volunteer)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response("Invalid id or volunteer does not exist", status=status.HTTP_404_NOT_FOUND)         
        else:
            volunteers = VolunteerProfile.objects.all()
            serializer = VolunteerProfileSerializer(volunteers, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)        


    def post(self, request):
        data = request.data
        user_data = data.get('user')
        volunteering_year = data.get('volunteering_year')
    
        if user_data is None:
            return Response("User data is required", status=status.HTTP_400_BAD_REQUEST)

        if isinstance(user_data, dict):
            serializer = UserSerializer(data=user_data)
            password = user_data.get('password')
            if password:
                user_data['password'] = make_password(password)
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
        volunteer = VolunteerProfile.objects.filter(pk=pk).first()
        if not volunteer:
            return Response("Volunteer does not exist", status=status.HTTP_404_NOT_FOUND)
        
        volunteer.delete()
        return Response("Volunteer deleted successfully", status=status.HTTP_204_NO_CONTENT)
    

    def put(self, request, pk):
        volunteer = VolunteerProfile.objects.filter(pk=pk).first()
        if not volunteer:
            return Response("Volunteer not exist", status=status.HTTP_404_NOT_FOUND)
        
        serializer = VolunteerProfileSerializer(volunteer, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


#APIVIew to handle Users

class UserAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, pk = None):
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
            return Response(serializer.data, status=status.HTTP_200_OK)
        
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response("New user has been created", status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        user = User.objects.filter(pk=pk).first()
        if not user:
            return Response("User not found", status=status.HTTP_404_NOT_FOUND)
        
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        user = User.objects.filter(pk=pk).first()
        if not user:
            return Response("User does not exist", status=status.HTTP_404_NOT_FOUND)
        
        user.delete()
        return Response("User deleted successfully", status=status.HTTP_204_NO_CONTENT)