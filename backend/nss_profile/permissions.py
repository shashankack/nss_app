from rest_framework.permissions import BasePermission

class IsCollegeAdmin(BasePermission):
    message = "You are not authorized to view "
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_staff
    
class IsSuperUser(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_superuser