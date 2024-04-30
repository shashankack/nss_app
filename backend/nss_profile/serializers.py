from rest_framework import serializers
from .models import VolunteerProfile, User

class VolunteerProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)

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
            