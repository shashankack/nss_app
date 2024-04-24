from rest_framework import serializers
from .models import VolunteerProfile, User

class VolunteerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = VolunteerProfile
        fields = '__all__'
        def create(self, validated_data):
            volunteer = VolunteerProfile.objects.create_volunteer(**validated_data)
            return volunteer


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

        def create(self, validated_data):
            user = User.objects.create_user(**validated_data)
            return user
            