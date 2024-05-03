from django.urls import path
from .views import EventAPIView, EventDetailAPIView, AttendanceAPIView

urlpatterns = [
    path('events/view/', EventAPIView.as_view()),
    path('events/view/<int:pk>/', EventAPIView.as_view()),
    path('events/create/', EventAPIView.as_view()),
    
    path('events/view/<int:pk>/', EventDetailAPIView.as_view()),
    path('events/update/<int:pk>/', EventDetailAPIView.as_view()),
    path('events/delete/<int:pk>/', EventDetailAPIView.as_view()),

    path('attendance/view/', AttendanceAPIView.as_view()),
    path('attendance/view/<int:pk>/', AttendanceAPIView.as_view()),
    path('attendance/create/', AttendanceAPIView.as_view()),
    path('attendance/delete/<int:pk>/', AttendanceAPIView.as_view()),
    path('attendance/update/<int:pk>/', AttendanceAPIView.as_view()),
]
