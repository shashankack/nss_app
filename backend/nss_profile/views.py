from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from .models import VolunteerProfile, User
from .serializers import VolunteerProfileSerializer, UserSerializer
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.hashers import make_password

""" 
class VolunteerAPIView(APIView):
    def get(self, request, pk=None):
        volunteers = VolunteerProfile.objects.all()
        serializer = VolunteerProfileSerializer(volunteers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    #def get(self, request, pk):
    #    volunteer = VolunteerProfile.objects.get(id=pk)
    #    serializer = VolunteerProfileSerializer(volunteer)
    #    return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        serializer = VolunteerProfileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserAPIView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request, pk=None):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
 """



class ListVolunteerAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, volunteer_id = None):
        if volunteer_id is not None:
            volunteer = VolunteerProfile.objects.filter(id=volunteer_id).first()
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
    permission_classes = [IsAuthenticated]
    def post(self, request):
        data = request.data
        user_data = data.get('user')
    
        if user_data is None or (not isinstance(user_data, dict) and not isinstance(user_data, int)):
            return Response("Invalid user data", status=status.HTTP_400_BAD_REQUEST)
    
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
            user = User.objects.filter(pk=user).first()
            if not user:
                return Response("User does not exist", status=status.HTTP_400_BAD_REQUEST)
            
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