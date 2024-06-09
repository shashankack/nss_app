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
    - POST: 

### /api/college-admin/ (ToDo)
- POST: 
- permission = [isAdmin]

### /api/college/ (ToDo)
- POST: 
- GET:
- PUT:
- DELETE:
-permission = [isAdmin]

### /api/courses/ (ToDo)
- POST:  [isAdmin]
- GET:
- PUT:  [isAdmin]
- DELETE:   [isAdmin]




### /api/loggedinuser/
{
"username": "",
"fn": "",
"ln": "",
"college": "",
"course":"",
"year": "",
"role": "CollegeAdmin/Volunteer/Lead",
}

if isCollegeAdmin()
 return new CollegeAdmin
 else :



Navbar {
    Logo
    College Name
    
    LoggedInUser {

    }
}