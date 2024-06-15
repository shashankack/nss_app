from rest_framework.permissions import BasePermission
from .models import CollegeAdmin

class IsCollegeAdmin(BasePermission):
    message = "You are not authorized to perform this action"
    def has_permission(self, request, view):
        return request.user and CollegeAdmin.objects.filter(user = request.user).exists()
    
class IsAdmin(BasePermission):
    message = "You are not authorized to perform this action"
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_admin