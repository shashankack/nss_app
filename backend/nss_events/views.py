from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from nss_profile.permissions import IsCollegeAdmin
from .serializers import EventSerializer, AttendanceSerializer, EventDetailSerializer
from .models import Events, Attendance
from django.utils import timezone
from datetime import datetime


class EventAPIView(APIView):
    #permission_classes = [IsAuthenticated]
    """ def get(self, request):      
        events = Events.objects.all()
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK) """
    
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
    
class EventDetailAPIView(APIView):
    #permission_classes = [IsAuthenticated]    
    def get(self, request, pk=None):
        if pk is not None:
            event = Events.objects.filter(pk=pk).first()
            if event:
                serializer = EventDetailSerializer(event)
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response("Event does not exist", status=status.HTTP_404_NOT_FOUND)
        else:
            events = Events.objects.all()
            serializer = EventDetailSerializer(events, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
       

class AttendanceAPIView(APIView):
    #permission_classes = [IsCollegeAdmin]
    def get(self, request, pk = None):
        event_id = pk
        if pk is not None:
            attendance = Attendance.objects.filter(event_id=event_id).first()
            if attendance:
                serializer = AttendanceSerializer(attendance)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response("Attendance record not found", status=status.HTTP_404_NOT_FOUND)
            
        else:
            attendances = Attendance.objects.all()
            serializer = AttendanceSerializer(attendances, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
    def post(self, request):
        serializer = AttendanceSerializer(data=request.data)
        if serializer.is_valid():
            volunteer = serializer.validated_data['volunteer']
            event = serializer.validated_data['event']
            if Attendance.objects.filter(event=event, volunteer=volunteer).exists():
                return Response("Attendance already exists for this volunteer in the event", status=status.HTTP_400_BAD_REQUEST)
            
            serializer.save()
            return Response("Attendance created", status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        attendance = Attendance.objects.filter(pk=pk).first()
        if not attendance:
            return Response("Attendance record not found.", status=status.HTTP_404_NOT_FOUND)
        
        serializer = AttendanceSerializer(attendance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response("Attendance has been updated", status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        attendance = Attendance.objects.filter(pk=pk).first()
        if not attendance:
            return Response("Attendance record not found", status=status.HTTP_404_NOT_FOUND)
        
        attendance.delete()
        return Response("Attendance record has been deleted", status=status.HTTP_204_NO_CONTENT)