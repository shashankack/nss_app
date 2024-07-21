--To create Events

 INSERT INTO public."Events" (name, college_id, description, instructions, start_datetime, end_datetime, duration, location, status, credit_points)
VALUES
    ('Test Event 1', 1, 'This is a test event 1', 'Follow the instructions', '2024-01-01 10:00:00', '2024-01-01 12:00:00', '2 hours', 'College Auditorium', 'Open', 10),
	('Test Event 1', 2, 'This is a test event 1', 'Follow the instructions', '2024-01-01 10:00:00', '2024-01-01 12:00:00', '2 hours', 'College Auditorium', 'Open', 10),
    ('Test Event 2', 1, 'This is a test event 2', 'Follow the instructions', '2024-01-04 10:30:00', '2024-01-04 15:30:00', '4 hours', 'College Auditorium', 'Open', 5),
    ('Test Event 2', 2, 'This is a test event 2', 'Follow the instructions', '2024-01-04 10:30:00', '2024-01-04 15:30:00', '4 hours', 'College Auditorium', 'Open', 5);

-- Create Colleges
INSERT INTO public."College"(college_name, city, college_code)
VALUES ('National College, Basavanagudi', 'Bengaluru', 'NCB-04'),
	   ('National College, Jayanagar', 'Bengaluru', 'NCJ-04');

-- Create NSS Years
INSERT INTO public."NSSYear"(start_date, end_date, label)
	VALUES 
	('2023-07-01', '2024-07-1', '2023-2024'),
    ('2024-07-01', '2025-07-1', '2024-2025');

-- Create Courses
INSERT INTO public."CollegeCourses"(course_name, specialization, status, college_id)
	VALUES 
	('Bachelor of Computer Application', 'None', 1, 1),
    ('Bachelor of Computer Application', 'None', 1, 2);

--Create Users
INSERT INTO public."Users"(username, email, gender, blood_group, first_name, last_name, is_admin, password, is_superuser, is_staff, is_active, date_joined)
    VALUES 
    ('AdminUser1', 'admin@test.com', 'M', 'O-', 'Admin', 'User', TRUE, 'pbkdf2_sha256$600000$QGGuiFIy8LwHeXF1eUyaSp$uZKolKeIhUCdOb6nAzygSY3pzPci2N4vYZYD5ezowlI=', TRUE, TRUE, TRUE, '2024-06-30'),
	('TestUser1', 'test1@test.com', 'M', 'A+', 'Test', 'User', TRUE, 'pbkdf2_sha256$600000$AbChq3OHBe9QcIfHDh3pgC$37vRQT2GTQLyMR5RMNSyMSTRV9983bnwumsifwAakKs=', FALSE, FALSE, TRUE, '2024-06-30'),
	('TestUser2', 'test2@test.com', 'F', 'O+', 'Test', 'User', TRUE, 'pbkdf2_sha256$600000$AbChq3OHBe9QcIfHDh3pgC$37vRQT2GTQLyMR5RMNSyMSTRV9983bnwumsifwAakKs=', FALSE, FALSE, TRUE, '2024-06-30');