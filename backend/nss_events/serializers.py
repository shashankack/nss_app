from rest_framework import serializers
from .models import Events, Attendance, EventComments
from nss_profile.models import Volunteer

class EventSerializer(serializers.ModelSerializer):
    college_name = serializers.CharField(source='college.college_name', read_only=True)

    class Meta:
        model = Events
        fields = '__all__'

    def create(self, validate_data):
        return Events.objects.create(**validate_data)
    
class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = '__all__'
        
class CollegeVolunteersSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    user_id = serializers.CharField(source='user.id', read_only=True)
    volunteer_id = serializers.CharField(source='id', read_only=True)
    

    class Meta:
        model = Volunteer
        fields = ['first_name', 'last_name', 'user_id', 'volunteer_id', 'role']

class EventAttendedVolunteersSerializer(serializers.ModelSerializer):

    event_id = serializers.IntegerField()
    volunteers = CollegeVolunteersSerializer(many=True)

class EventCommentsSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)

    class Meta:
        model = EventComments
        fields = '__all__'