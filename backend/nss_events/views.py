from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from nss_profile.permissions import IsCollegeAdmin
from .serializers import EventSerializer, AttendanceSerializer
from .models import Events, Attendance
from nss_profile.models import VolunteerProfile
from django.utils import timezone
from datetime import datetime


class EventAPIView(APIView):
    #permission_classes = [IsAuthenticated]
    def get(self, request, pk=None):
        if pk is not None:
            event = Events.objects.filter(pk=pk).first()
            if event:
                serializer = EventSerializer(event)
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response("Event does not exist", status=status.HTTP_404_NOT_FOUND)
        else:
            events = Events.objects.all()
            serializer = EventSerializer(events, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):        
        data = request.data
        start_date_str = data.get('start_date')
        start_time_str = data.get('start_time')

        if start_date_str is None or start_time_str is None:
            return Response("Start date and start time cannot be empty", status=status.HTTP_400_BAD_REQUEST)
        
        start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
        start_time = datetime.strptime(start_time_str, '%H:%M').time()

        start_datetime = timezone.make_aware(timezone.datetime.combine(start_date, start_time))

        current_datetime = timezone.now()
        if start_datetime < current_datetime:
            return Response("Event start date and time cannot be in the past.", status=status.HTTP_400_BAD_REQUEST)
        
        serializer = EventSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, pk):
        event = Events.objects.filter(pk=pk).first()
        serializer = EventSerializer(event, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        event = Events.objects.filter(pk=pk).first()
        event.delete()
        return Response("Event deleted", status=status.HTTP_204_NO_CONTENT)
    

class AttendanceAPIView(APIView):
    #permission_classes = [IsCollegeAdmin]
    def get(self, request, event_id):
        #event_id = pk
        if event_id is None:
            return Response('Event does not exist', status=status.HTTP_404_NOT_FOUND)
        
        attendance = Attendance.objects.filter(event_id=event_id).first()
        if attendance:
            serializer = AttendanceSerializer(attendance)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response("No attendance marked for this event", status=status.HTTP_404_NOT_FOUND)
                    
    """ def post(self, request, event_id):
        if event_id is None:
            return Response("Event does not exist", status=status.HTTP_404_NOT_FOUND)
        
        serializer = AttendanceSerializer(data=request.data)
        if serializer.is_valid():
            volunteer = serializer.validated_data['volunteer']
            event = serializer.validated_data['event']
            if Attendance.objects.filter(event=event, volunteer=volunteer).exists():
                return Response("Attendance already exists for this volunteer in the event", status=status.HTTP_400_BAD_REQUEST)
            
            serializer.save()
            return Response("Attendance created", status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) """
    
    def post(self, request, event_id):
        if event_id is None:
            return Response("Event not found", status=status.HTTP_404_NOT_FOUND)
        
        serializer = AttendanceSerializer(data=request.data)
        if serializer.is_valid():
            event = Events.objects.filter(event_id=event_id).first()
            volunteer_ids = request.data.get('volunteer_ids', [])
            volunteers = VolunteerProfile.objects.filter(id__in=volunteer_ids)
            existing_volunteer_ids = set(volunteers.values_list('id', flat=True))

            missing_volunteer_ids = set(volunteer_ids) - existing_volunteer_ids
            if missing_volunteer_ids:
                return Response(f'Volunteers with IDs {", ".join(map(str, missing_volunteer_ids))} do not exist', status=status.HTTP_404_NOT_FOUND)

            existing_attendance = Attendance.objects.filter(event=event, volunteer__in=volunteers)
            if existing_attendance.exists():
                return Response("Attendance already exists for one or more volunteers in this event", status=status.HTTP_400_BAD_REQUEST)
            
            attendance_records = [Attendance(event=event, volunteer=volunteer) for volunteer in volunteers]
            Attendance.objects.bulk_create(attendance_records)
            return Response("Attendance has been marked", status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, event_id):
        attendance = Attendance.objects.filter(event_id=event_id).first()
        if not attendance:
            return Response("Attendance record not found", status=status.HTTP_404_NOT_FOUND)
        
        attendance.delete()
        return Response("Attendance record has been deleted", status=status.HTTP_204_NO_CONTENT)