from rest_framework import serializers
from .models import Address, User


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ['id', 'street', 'city', 'state', 'postal_code', 'country']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'gender', 'dob', 'email', 'contact', 'blood_group', 'address']

    address = AddressSerializer()  # Nested serialization of Address model
