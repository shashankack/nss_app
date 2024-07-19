from django.db.models.functions import Cast
from django.db.models import Count, F, IntegerField, FloatField, ExpressionWrapper, Sum
from django.db.models.functions import Cast
from django.db.models import IntegerField
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .serializers import EventSerializer, AttendanceSerializer, CollegeVolunteersSerializer, EventCommentsSerializer
from .models import Events, Attendance, EventComments
from nss_profile.models import Volunteer, NSSYear, CollegeAdmin

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
                return Response({'error': 'Event does not exist'}, status=status.HTTP_404_NOT_FOUND)
            
            attendance = Attendance.objects.filter(event=event)
            if not attendance.exists():
                return Response({'error': 'No attendance marked'}, status=status.HTTP_404_NOT_FOUND)
        else:
            attendance = Attendance.objects.all()
        serializer = AttendanceSerializer(attendance, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
                    
    def post(self, request, event_id):
        event = Events.objects.filter(id=event_id).first()
        if not event:
            return Response({'error':'Event does not exist'}, status=status.HTTP_404_NOT_FOUND)
        
        volunteer_ids = request.data.get('volunteer_ids')
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


    
#Leaderboard view with get reqeust which will return the top volunterss with highest credit score
class LeaderboardAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get_college(self, user_id, volunteering_year):
        return Volunteer.objects.get(user_id=user_id, volunteering_year=volunteering_year)
    
    def get(self, request):
        volunteering_year = NSSYear.current_year()
        college = self.get_college(request.user.id, volunteering_year).course.college
        print('******',college)
        volunteers_with_credits = Volunteer.objects.filter(
            volunteering_year=NSSYear.current_year(),
            user__is_active=True,
            course__college=college,
            ).annotate(
                total_credits=Sum('attendance__event__credit_points'),
                first_name=F('user__first_name'),
                last_name=F('user__last_name'),
                ).values('first_name', 'last_name', 'user_id', 'total_credits')
        sorted_volunteers = sorted(volunteers_with_credits, key=lambda x: x['total_credits'] or 0, reverse=True)

        ranked_volunteers = []
        current_rank = 1
        previous_credits = None

        for idx, volunteer in enumerate(sorted_volunteers, start=1):
            if volunteer['total_credits'] != previous_credits:
                current_rank = idx
            volunteer['rank'] = current_rank
            previous_credits = volunteer['total_credits']
            ranked_volunteers.append(volunteer)
        return Response(ranked_volunteers, status=status.HTTP_200_OK)
    
class ServiceHoursAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get_college(self, user_id, volunteering_year):
        return Volunteer.objects.get(user_id=user_id, volunteering_year=volunteering_year)

    def get(self, request):
        # Return total service hours for the selected college by multiplying number of attended volunteers with duration field in Event for completed events
        volunteering_year = NSSYear.current_year()
        college = self.get_college(request.user.id, volunteering_year).course.college
        # completed_events = Events.objects.filter(college=college, status=Events.STATUS_COMPLETED)

        events_with_service_hours = Events.objects.filter(
            college_id=college.id,
            status=Events.STATUS_COMPLETED
        ).annotate(
            # Count active volunteers for each event
            active_volunteers_count=Count('attendance'),
            # Convert duration to integer hours (assuming it’s stored as a text field representing hours)
            duration_hours=Cast('duration', FloatField())
        ).annotate(
            # Calculate service hours for each event
            service_hours=ExpressionWrapper(
                F('duration_hours') * F('active_volunteers_count'),
                output_field=FloatField()
            )
        ).aggregate(
            total_service_hours=Sum('service_hours')
        )



        total_service_hours = events_with_service_hours['total_service_hours'] or 0
        return Response(total_service_hours, status=status.HTTP_200_OK) 

class EventAttendedVolunteersAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, event_id):
        event = Events.objects.filter(id=event_id).first()
        if not event:
            return Response("Event does not exist", status=status.HTTP_404_NOT_FOUND)
        
        volunteers = list(Attendance.objects.filter(event=event).select_related('volunteer').values_list('volunteer__id', flat=True))

        if len(volunteers) == 0:
            return Response("Attendance does not exist for this event", status=status.HTTP_404_NOT_FOUND)
        
        serializer = CollegeVolunteersSerializer(Volunteer.objects.filter(id__in=volunteers), many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class EventCommentsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get_admins_college(self, user_id):
        try:
            return CollegeAdmin.objects.get(user_id=user_id).college
        except CollegeAdmin.DoesNotExist:
            return None
        
    def get(self, request, event_id):
        event = Events.objects.filter(id=event_id).first()
        comments = EventComments.objects.filter(event=event)
        serializer = EventCommentsSerializer(comments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request, event_id):
        event = Events.objects.filter(id=event_id).first()
        data = request.data
        data['user'] = request.user.id
        data['event'] = event_id
        serializer = EventCommentsSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, comment_id):
        comment = EventComments.objects.filter(id=comment_id).first()
        comment.is_hidden = True
        comment.save()

        return Response('Comment has been deleted', status=status.HTTP_204_NO_CONTENT)