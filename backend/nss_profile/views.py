from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from .models import VolunteerProfile, User
from .serializers import VolunteerProfileSerializer, UserSerializer
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.hashers import make_password


class ListVolunteerAPIView(APIView):
    #permission_classes = [IsAuthenticated]
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
        

class CreateVolunteerAPIView(APIView):
    #permission_classes = [IsAuthenticated]
    def post(self, request):
        data = request.data
        user_data = data.get('user')
    
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
            
        else:
            user_id = user_data
            user = User.objects.filter(pk=user_id).first()
            if not user:
                return Response("User does not exist", status=status.HTTP_400_BAD_REQUEST)
            data['user'] = user.id
            
        serializer = VolunteerProfileSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)      


class DeleteVolunteerAPIView(APIView):
    def delete(self, request, pk):
        volunteer = VolunteerProfile.objects.filter(pk=pk).first()
        if not volunteer:
            return Response("Volunteer does not exist", status=status.HTTP_404_NOT_FOUND)
        
        volunteer.delete()
        return Response("Volunteer deleted successfully", status=status.HTTP_204_NO_CONTENT)
    
class UpdateVolunteerAPIView(APIView):
    def put(self, request, pk):
        volunteer = VolunteerProfile.objects.filter(pk=pk).first()
        if not volunteer:
            return Response("Volunteer does not exist", status=status.HTTP_404_NOT_FOUND)
        
        serializer = VolunteerProfileSerializer(data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ListUserAPIView(APIView):
    #permission_classes = [IsAuthenticated]
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
        