# Backend App to serve all the APIs

## User APIs
### - /api/login (Done)
### - /api/token/refresh (Done)
- POST: 
    > RefreshToken
    > AccessToken
### - /api/loggedInUserProfile/ (Done)
- GET:
    > Retrive the details of the logged in user


### - /api/volunteer/<int:id>/ (Done)
- GET: 
    > Returns all the volunteers or a single volunteer if the ID is provided.
- PUT:
    > Updated the volunteer details
- DELETE:
- POST:
    > Create a volunteer with new user.
    {
        "user": {
            "username": "",
            "email": "",
            "password": "",
            "gender": "",
            "blood_group": ""
        },
        "volunteering_year": "",
        "course": ""
    }

    > Create a volunteer for an existing user.
    {
        "user": "user_id",
        "volunteering_year": "",
        "course": ""
    }


### /api/user/  (ToDo)
    - POST: {
        "username": "",
        "email": "",
        "password": "",
        "gender": "",
        "blood_group": ""
        "is_admin"
    }

### /api/college-admin/ (Done)
- The users in this table will be considered as the college admin for that college
- POST: {
    "user": "user_id",
    "college": "college_id"
}
- PUT:
- permission = [isAdmin]

### /api/college/ :College Model | CollegeAPIView
- POST: 
    {
        "college_name" : "",
        "college_code" : "",
        "city": "",
    }
- GET:
- PUT:
- DELETE:
-permission = [isAdmin]

### /api/courses/ :CollegeCourses Model | CoursesAPIView
- POST:  [isAdmin] {
    "college" : college_id,
    "course" : "course_name",
    "specialization" : "",
    "year" : 20__,
    "status" = "active/inactive, 0/1"
}
- GET:
- PUT:  [isAdmin]
- DELETE:   [isAdmin]


### Creating Test Data
- To create basic required data run this command in the nss_api container.
`./manage.py dbshell < TestData.sql`