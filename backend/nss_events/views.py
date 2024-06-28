from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .serializers import EventSerializer, AttendanceSerializer
from .models import Events, Attendance
from nss_profile.models import Volunteer    
from nss_profile.models import NSSYear

class EventAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, event_id=None):
        event_status = request.GET.get('status')
        if event_id is not None:
            event = Events.objects.filter(id=event_id).first()
            if not event:
                return Response("Event does not exist", status=status.HTTP_404_NOT_FOUND)
            
            serializer = EventSerializer(event)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            events = Events.objects.filter(status=event_status)
            serializer = EventSerializer(events, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):        
        data = request.data
        data['college'] = Volunteer.objects.get(user_id=request.user.id).course.college.id
        serializer = EventSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, event_id):
        event = Events.objects.filter(id=event_id).first()
        serializer = EventSerializer(event, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, event_id):
        event = Events.objects.filter(id=event_id).first()
        if not event:
            return Response('Event does not exist', status=status.HTTP_404_NOT_FOUND)
        event.status = event.STATUS_DELETED
        event.save()
        return Response("Event deleted", status=status.HTTP_204_NO_CONTENT)
    

class AttendanceAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, event_id):
        if event_id is not None:
            event = Events.objects.filter(id=event_id).first()
            if not event:
                return Response("Event does not exist", status=status.HTTP_404_NOT_FOUND)
            
            attendance = Attendance.objects.filter(event=event)
            if not attendance.exists():
                return Response('No attendance marked', status=status.HTTP_404_NOT_FOUND)
        else:
            attendance = Attendance.objects.all()
        serializer = AttendanceSerializer(attendance, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
                    
    def post(self, request, event_id):
        event = Events.objects.filter(id=event_id).first()
        if not event:
            return Response({'error':'Event does not exist'}, status=status.HTTP_404_NOT_FOUND)
        
        volunteer_ids = request.data.get('volunteers')
        if not volunteer_ids:
            return Response({'error':'Volunteer ID\'s are required'}, status=status.HTTP_400_BAD_REQUEST)
        
        attendances = []
        for volunteer_id in volunteer_ids:
            volunteer = Volunteer.objects.filter(id=volunteer_id).first()
            if not volunteer:
                return Response({'error':f'Volunteer {volunteer_id} not found'}, status=status.HTTP_404_NOT_FOUND)
            
            attendance = Attendance.objects.filter(volunteer=volunteer, event=event).exists()
            if attendance:
                return Response({'error':f'Attendance for volunteer ({volunteer_id}) in the event ({event_id}) already exists'}, status=status.HTTP_400_BAD_REQUEST)
            
            attendance = Attendance.objects.create(volunteer=volunteer, event=event)
            attendances.append(attendance)
        return Response(f'Attendance marked for {volunteer_ids}', status=status.HTTP_201_CREATED)
    
    def delete(self, request, event_id):
        # TODO : implement
        pass
    
class EventsAttendedAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        events = list(Attendance.objects.filter(volunteer__user_id=request.user.id,
                                            volunteer__volunteering_year=NSSYear.current_year(),
                                            ).select_related('event').values_list('event__id', flat=True))
        return Response(events, status=status.HTTP_200_OK)
        