""" from django.urls import path
from . import views

urlpatterns = [
    path('addresses/', views.AddressAPIView.as_view(), name='address-list'),
    path('addresses/<int:address_id>/', views.AddressAPIView.as_view(), name='address-detial'),
    path('users/', views.UserAPIView.as_view(), name='user-list'),
    path('users/<int:user_id>/', views.UserAPIView.as_view(), name='user-detail'),
]
 """


from django.urls import path
from .views import AddressList, AddressDetails, UserList, UserDetails

urlpatterns = [
    path('user/', UserList.as_view()),
    path('user/<int:pk>/', UserDetails.as_view()),
    path('address/', AddressList.as_view()),
    path('address/<int:pk>/', AddressDetails.as_view()),
]
