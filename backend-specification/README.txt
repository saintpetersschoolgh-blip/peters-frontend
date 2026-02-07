================================================================================
ST. PETER'S SCHOOL MANAGEMENT SYSTEM - BACKEND SPECIFICATION
================================================================================

This folder contains the complete backend specification for implementing the
school management system in C# with PostgreSQL database.

================================================================================
FILE STRUCTURE
================================================================================

01_PROJECT_OVERVIEW.txt
   - System architecture
   - Technology stack
   - User roles
   - API structure
   - Dependencies
   - Environment configuration

02_DATABASE_SCHEMA.txt
   - Complete PostgreSQL database schema
   - All tables with columns, types, constraints
   - Indexes
   - Foreign keys
   - Triggers
   - Relationships

03_AUTHENTICATION.txt
   - Authentication flow
   - JWT token implementation
   - Password reset
   - Authorization (RBAC)
   - Security measures
   - API endpoints for auth

04_API_ENDPOINTS.txt
   - Complete list of all API endpoints
   - Request/response formats
   - Parameters
   - Access control
   - Pagination
   - Filtering

05_DATA_MODELS.txt
   - C# entity models
   - DTOs (Data Transfer Objects)
   - AutoMapper configuration
   - Validation attributes
   - Enums

06_BUSINESS_LOGIC.txt
   - Business rules for all modules
   - Validation rules
   - Workflow rules
   - Error handling
   - Performance optimization

07_IMPLEMENTATION_GUIDE.txt
   - Step-by-step implementation
   - Phase-by-phase approach
   - Coding standards
   - Testing checklist
   - Deployment preparation

08_NOTIFICATION_SYSTEM.txt
   - Email configuration
   - SMS configuration
   - Notification channels
   - Smart notification rules
   - Background processing

09_REPORTS_ANALYTICS.txt
   - All report endpoints
   - Report parameters
   - Data requirements
   - Export formats
   - Dashboard endpoints

10_REQUESTS_RESPONSES.txt
   - Complete request/response reference
   - Example JSON for all endpoints
   - Standard formats (success, error, pagination)
   - Query parameters reference
   - HTTP status codes

================================================================================
HOW TO USE THIS SPECIFICATION
================================================================================

1. START HERE: Read 01_PROJECT_OVERVIEW.txt to understand the system

2. DATABASE: Use 02_DATABASE_SCHEMA.txt to create your PostgreSQL database
   - Run the SQL scripts in order
   - Create indexes
   - Set up triggers

3. AUTHENTICATION: Follow 03_AUTHENTICATION.txt to implement auth system
   - Set up JWT
   - Create auth endpoints
   - Implement password reset

4. API ENDPOINTS: Use 04_API_ENDPOINTS.txt as reference for all endpoints
   - Implement controllers
   - Follow request/response formats

5. REQUESTS & RESPONSES: Use 10_REQUESTS_RESPONSES.txt for exact request/response
   - Example JSON bodies for all endpoints
   - Error response formats
   - Pagination structure

6. DATA MODELS: Use 05_DATA_MODELS.txt to create your C# models
   - Entity models
   - DTOs
   - AutoMapper profiles

7. BUSINESS LOGIC: Follow 06_BUSINESS_LOGIC.txt for all business rules
   - Validation
   - Workflows
   - Error handling

8. IMPLEMENTATION: Follow 07_IMPLEMENTATION_GUIDE.txt step-by-step
   - Phase 1: Setup
   - Phase 2: Database
   - Phase 3: Authentication
   - Continue through all phases

9. NOTIFICATIONS: Use 08_NOTIFICATION_SYSTEM.txt for email/SMS
   - Configure email
   - Configure SMS
   - Implement channels

10. REPORTS: Use 09_REPORTS_ANALYTICS.txt for all reports
   - Implement report endpoints
   - Data aggregation
   - Export functionality

================================================================================
IMPLEMENTATION ORDER (RECOMMENDED)
================================================================================

Phase 1: Foundation
   1. Project setup (07_IMPLEMENTATION_GUIDE.txt - Phase 1)
   2. Database schema (02_DATABASE_SCHEMA.txt)
   3. Entity models (05_DATA_MODELS.txt)

Phase 2: Authentication
   1. JWT setup (03_AUTHENTICATION.txt)
   2. Auth endpoints (03_AUTHENTICATION.txt)
   3. User management (04_API_ENDPOINTS.txt - Users section)

Phase 3: Core Entities
   1. Students (04_API_ENDPOINTS.txt - Students section)
   2. Teachers (04_API_ENDPOINTS.txt - Teachers section)
   3. Parents (04_API_ENDPOINTS.txt - Parents section)
   4. Classrooms (04_API_ENDPOINTS.txt - Classrooms section)
   5. Subjects (04_API_ENDPOINTS.txt - Subjects section)

Phase 4: Academic System
   1. Exams (04_API_ENDPOINTS.txt - Exams section)
   2. Exam Results (04_API_ENDPOINTS.txt - Results section)
   3. Syllabus (04_API_ENDPOINTS.txt - Syllabus section)
   4. Timetable (04_API_ENDPOINTS.txt - Timetable section)
   5. Lesson Notes (04_API_ENDPOINTS.txt - Lesson Notes section)

Phase 5: Attendance & Finance
   1. Student Attendance (04_API_ENDPOINTS.txt - Attendance section)
   2. Teacher Attendance (04_API_ENDPOINTS.txt - Attendance section)
   3. Fee Structure (04_API_ENDPOINTS.txt - Finance section)
   4. Payments (04_API_ENDPOINTS.txt - Finance section)

Phase 6: Notifications
   1. Notification system (08_NOTIFICATION_SYSTEM.txt)
   2. Email service (08_NOTIFICATION_SYSTEM.txt)
   3. SMS service (08_NOTIFICATION_SYSTEM.txt)

Phase 7: Settings
   1. Settings endpoints (04_API_ENDPOINTS.txt - Settings section)
   2. Admin setup endpoints (04_API_ENDPOINTS.txt - Admin Setup section)

Phase 8: Reports
   1. Report endpoints (09_REPORTS_ANALYTICS.txt)
   2. Dashboard endpoints (09_REPORTS_ANALYTICS.txt)

Phase 9: Testing & Deployment
   1. Testing (07_IMPLEMENTATION_GUIDE.txt - Phase 17)
   2. Deployment (07_IMPLEMENTATION_GUIDE.txt - Phase 18)

================================================================================
KEY TECHNOLOGIES
================================================================================

- .NET 8.0 or later
- ASP.NET Core Web API
- Entity Framework Core
- PostgreSQL Database
- JWT Authentication
- AutoMapper
- FluentValidation
- MailKit (Email)
- Serilog (Logging)
- Swagger/OpenAPI

================================================================================
IMPORTANT NOTES
================================================================================

1. All dates should be stored in UTC in the database
2. Convert to local time in the API layer based on user timezone
3. Use soft deletes (is_active flag) instead of hard deletes
4. Implement audit logging for all create/update/delete operations
5. Validate all inputs on the server side
6. Use pagination for all list endpoints
7. Implement proper error handling and logging
8. Follow RESTful API conventions
9. Use async/await for all I/O operations
10. Implement proper authorization checks on all endpoints

================================================================================
SUPPORT
================================================================================

When implementing, refer to:
- Business rules in 06_BUSINESS_LOGIC.txt
- API specifications in 04_API_ENDPOINTS.txt
- Request/response examples in 10_REQUESTS_RESPONSES.txt
- Data models in 05_DATA_MODELS.txt
- Implementation steps in 07_IMPLEMENTATION_GUIDE.txt

For questions about specific features, refer to the relevant section in the
appropriate file.

================================================================================
VERSION
================================================================================

Specification Version: 1.0
Date: 2026-02-04
Frontend Version: Compatible with current frontend implementation

================================================================================
