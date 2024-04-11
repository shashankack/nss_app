""" from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from . import models, serializers

class AddressAPIView(APIView):
    def get(self, request, address_id=None):
        if address_id:
            address = models.Address.objects.get(pk=address_id)
            serializer = serializers.AddressSerializer(address)
            return Response(serializer.data)
        else:
            addresses = models.Address.objects.all()
            serializer = serializers.AddressSerializer(addresses, many=True)
            return Response(serializer.data)
        
    def post(self, request):
        serializer = serializers.AddressSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, address_id):
        address = models.Address.objects.get(pk=address_id)
        serializer = serializers.AddressSerializer(address, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, address_id):
        address = models.Address.objects.get(pk=address_id)
        address.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class UserAPIView(APIView):
    def get(self, request, user_id=None):
        if user_id:
            user = models.User.objects.get(pk=user_id)
            serializer = serializers.UserSerializer(user)
            return Response(serializer.data)
        else:
            users = models.User.objects.all()
            serializer = serializers.UserSerializer(users, many=True)
            return Response(serializer.data)
        
    def post(self, request):
        serializer = serializers.UserSerializer(data=request.data)
        if serializer.is_valid():
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, user_id):
        user = models.User.objects.get(pk=user_id)
        serializer = serializers.UserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, user_id):
        user = models.User.objects.get(pk=user_id)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT) """



from rest_framework import generics
from .models import Address, User
from .serializers import AddressSerializer, UserSerializer

class UserList(generics.ListCreateAPIView):
    serializer_class = UserSerializer

    def get_queryset(self):
        queryset = User.objects.all()
        address = self.request.query_params.get('address')
        if address is not None:
            queryset = queryset.filter(address = address)
        return queryset
    
class UserDetails(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UserSerializer
    queryset = User.objects.all()


class AddressList(generics.ListCreateAPIView):
    serializer_class =AddressSerializer
    queryset = Address.objects.all()


class AddressDetails(generics.RetrieveUpdateDestroyAPIView):
    serializer_class =  AddressSerializer
    queryset = Address.objects.all()