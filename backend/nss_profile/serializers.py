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

    def create(self, validated_data):
        address_data = validated_data.pop('address')  # Remove nested address data from validated_data
        address = Address.objects.create(**address_data)  # Create Address instance
        user = User.objects.create(address=address, **validated_data)  # Create User instance with associated address
        return user
    address = AddressSerializer()  # Nested serialization of Address model
