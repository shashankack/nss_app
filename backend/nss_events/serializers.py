from rest_framework import serializers
from .models import Events, Attendance

class EventSerializer(serializers.ModelSerializer):
    #start_datetime_epoch = serializers.IntegerField(read_only=True)
    class Meta:
        model = Events
        fields = ['id','name', 'description', 'status', 'start_date']

    def create(self, validate_data):
        return Events.objects.create(**validate_data)


class EventDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Events
        fields = '__all__'
        

class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = '__all__'