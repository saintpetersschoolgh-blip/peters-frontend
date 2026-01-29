# ST's Peters School Management System

A comprehensive school management solution built with React, TypeScript, and Vite. This system provides role-based dashboards for **Admin**, **Head‑Master**, **Teacher**, **Student**, and **Parent** with **demo authentication** enabled.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
```bash
# Clone or navigate to the project directory
cd st\'s-peters

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:5173`

## 🔐 Demo Authentication (Credentials)

The app uses a **simple demo auth**:

- **Password (same for all users)**: `admin123`
- **Role is inferred from the username** (contains one of: `admin`, `head-master` / `headmaster`, `teacher`, `student`, `parent`)

### Demo usernames

- **Admin**: `admin001`
- **Head‑Master**: `head-master001`
- **Teacher**: `teacher001`
- **Student**: `student001`
- **Parent**: `parent001`

### Behavior

- If you are **not logged in**, any protected page will send you to **`/login`**
- After login, you are redirected to the dashboard that belongs to your role:
  - Admin → `/admin`
  - Head‑Master → `/head-master`
  - Teacher → `/teacher`
  - Student → `/student`
  - Parent → `/parent`
- If you try to open a page you don’t have access to, you’ll see **Access denied**
- The sidebar only shows navigation items for your role

## 📋 Dashboard Access Links

### 🎯 Main Entry Point
- **Home Page**: [http://localhost:5173/](http://localhost:5173/)
  - Landing page with overview of all available dashboards

### 👨‍💼 Administrator Dashboard
- **URL**: [http://localhost:5173/admin](http://localhost:5173/admin)
- **Features**:
  - School-wide analytics and reporting
  - Risk monitoring and alerts
  - User management
  - System-wide performance metrics
  - Attendance analytics
  - Financial overview
- **Submenus**: User Management, Classrooms, Subjects, Students, Attendance, Academic, Finance, Notifications

### 👨‍🏫 Teacher Dashboard
- **URL**: [http://localhost:5173/teacher](http://localhost:5173/teacher)
- **Features**:
  - Class management tools
  - Lesson planning and tracking
  - Student oversight
  - Grade management
  - Attendance monitoring
  - Communication tools
- **Submenus**: Profile, Timetable, Lesson Notes, Syllabus, Student Management, Attendance

### 👨‍🎓 Student Dashboard
- **URL**: [http://localhost:5173/student](http://localhost:5173/student)
- **Features**:
  - Personal academic tracking
  - Attendance records
  - Grade history
  - Homework assignments
  - Exam results
  - Fee status

### 👨‍👩‍👧‍👦 Parent Dashboard
- **URL**: [http://localhost:5173/parent](http://localhost:5173/parent)
- **Features**:
  - Child performance monitoring
  - Attendance tracking
  - Communication with teachers
  - Fee payment history
  - Academic progress reports

### 🧑‍🏫 Head‑Master Dashboard
- **URL**: [http://localhost:5173/head-master](http://localhost:5173/head-master)
- **Features**:
  - Executive oversight (demo)
  - Access to head-master pages only

### 📊 Student Management
- **URL**: [http://localhost:5173/students](http://localhost:5173/students)
- **Features**:
  - Student records management
  - Profile management
  - Academic tracking
  - Bulk operations

## 🏗️ System Architecture

### Technology Stack
- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **Routing**: Custom hash-based router

### Project Structure
```
st's-peters/
├── app/                    # Page components (Next.js style)
│   ├── page.tsx           # Home page
│   ├── admin/
│   ├── teacher/
│   ├── student/
│   ├── parent/
│   └── students/
├── components/            # Reusable UI components
│   ├── Header.tsx        # Navigation header
│   └── Sidebar.tsx       # Navigation sidebar
├── lib/                   # Utility libraries
│   ├── navigation.ts     # Routing logic
│   ├── api-client.ts     # API client (mock)
│   └── auth-context.tsx  # Authentication context (demo auth enabled)
├── types.ts              # TypeScript type definitions
├── constants.tsx         # Application constants
└── index.tsx             # Application entry point
```

## 🎨 Key Features

### 📈 Analytics & Reporting
- Real-time performance metrics
- Attendance analytics
- Financial reporting
- Risk monitoring and alerts

### 👥 User Management
- Role-based access control
- User profile management
- Bulk operations support

### 📚 Academic Management
- Grade and exam management
- Lesson planning tools
- Syllabus tracking
- Homework assignments

### 💰 Financial Management
- Fee structure management
- Payment tracking
- Financial reporting

### 📞 Communication
- Integrated messaging system
- Notification management
- Parent-teacher communication

## 🔧 Development

### Available Scripts
```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

### Code Style
- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Tailwind CSS for styling

## 📝 API Integration

The system currently uses mock data but is designed to integrate with a backend API. The API client is configured in `lib/api-client.ts` and can be easily connected to a real backend.

### Mock Data Structure
- All data is currently simulated
- No external dependencies required
- Easy to replace with real API calls

## 🎯 User Roles & Permissions

### Administrator
- Full system access
- User management
- System configuration
- Analytics and reporting

### Head‑Master
- Executive dashboard access (demo)
- Access to head-master section

### Teacher
- Class management
- Student oversight
- Lesson planning
- Grade management

### Student
- Personal academic data
- Attendance records
- Assignment tracking

### Parent
- Child performance monitoring
- Communication tools
- Fee payment tracking

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile devices

## 🧪 Testing

Currently uses mock data for all functionality. To test with real data, replace the mock implementations in the respective page components.

## 📄 License

© 2026 ST's Peters School Management System. All rights reserved.

## 🤝 Contributing

This is a demonstration project. For contributions or modifications, please ensure all new code follows the existing patterns and maintains the component structure.

---

**Quick Access Links:**
- 🏠 [Home](http://localhost:5173/)
- 👨‍💼 [Admin Dashboard](http://localhost:5173/admin) *(with submenus)*
- 👨‍🏫 [Teacher Dashboard](http://localhost:5173/teacher) *(with submenus)*
- 👨‍🎓 [Student Dashboard](http://localhost:5173/student) *(with submenus)*
- 👨‍👩‍👧‍👦 [Parent Dashboard](http://localhost:5173/parent) *(with submenus)*
- 📊 [Student Management](http://localhost:5173/students)

*All dashboards now feature expandable submenus for enhanced navigation!*