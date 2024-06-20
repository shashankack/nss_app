from rest_framework import serializers
from .models import Events, Attendance

class EventSerializer(serializers.ModelSerializer):
    formatted_date = serializers.SerializerMethodField()
    formatted_time = serializers.SerializerMethodField()

    class Meta:
        model = Events
        fields = '__all__'

    def create(self, validate_data):
        return Events.objects.create(**validate_data)
    
    def get_formatted_date(self, obj):
        return obj.start_date_time.strftime('%d-%m-%Y')
    
    def get_formatted_time(self, obj):
        return obj.start_date_time.strftime('%I:%M %p')
    


class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = '__all__'