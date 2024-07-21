from rest_framework import serializers
from .models import Volunteer, User, College, CollegeAdmin, CollegeCourses, NSSYear

class NSSYearSerializer(serializers.ModelSerializer):
    class Meta:
        model = NSSYear
        fields = ['label']

class VolunteerSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    college = serializers.SerializerMethodField()
    volunteering_year = NSSYearSerializer()

    class Meta:
        model = Volunteer
        fields = '__all__'
    
    def create(self, validated_data):
        volunteer = Volunteer.objects.create(**validated_data)
        return volunteer
    
    def get_college(self, obj):
        return obj.course.college.college_name
    
    def get_volunteering_year(self, obj):
        return obj.volunteering_year.label


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

    def create(self, validated_data):
        user = User.objects.create(**validated_data)
        password = validated_data.pop('password', None)
        if password:
            user.set_password(password)
        user.save()
        return user 
        
class CollegeAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = CollegeAdmin
        fields = '__all__'

    def create(self, validated_data):
        admin = CollegeAdmin.objects.create(**validated_data)
        return admin
    

class CollegeSerializer(serializers.ModelSerializer):
    class Meta:
        model = College
        fields = '__all__'
    
    def create(self, validated_data):
        college = College.objects.create(**validated_data)
        return college
    
class CollegeCoursesSerializer(serializers.ModelSerializer):
    class Meta:
        model = CollegeCourses
        fields = '__all__'

    def create(self, validated_data):
        course = CollegeCourses.objects.create(**validated_data)
        return course