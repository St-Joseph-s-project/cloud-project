# 📊 Cloud Project - Comprehensive Technical Report

> **Project**: St. Joseph's College - Cloud-Based Learning Management System  
> **Purpose**: Interview Experience Sharing Platform & Coding Practice System  
> **Submission Date**: February 18, 2026  
> **Team**: Collaborative Development Project

---

## 📋 Executive Summary

This project is a comprehensive **Full-Stack Web Application** designed for St. Joseph's College to facilitate:

1. **Interview Experience Sharing Platform** - Students can share and learn from interview experiences
2. **Coding Practice System** - Practice coding problems with automated testing
3. **Test Management System** - Conduct and manage programming tests
4. **Student Profile Management** - Track student progress and achievements
5. **Gamification Features** - Coins, streaks, and leaderboard system

---

## 🏗️ System Architecture

### Architecture Type
**Three-Tier Architecture** (Client-Server-Database)

```
┌─────────────────┐
│   Client Layer  │  → React + TypeScript + Vite
│  (Frontend UI)  │
└────────┬────────┘
         │ REST API
┌────────▼────────┐
│  Server Layer   │  → Node.js + Express + TypeScript
│  (Backend API)  │
└────────┬────────┘
         │ Prisma ORM
┌────────▼────────┐
│ Database Layer  │  → PostgreSQL
│   (Data Store)  │
└─────────────────┘
```

---

## 🔧 Technology Stack

### Frontend Technologies
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3.1 | UI Framework |
| **TypeScript** | 5.2.2 | Type Safety |
| **Vite** | 5.2.0 | Build Tool & Dev Server |
| **Redux Toolkit** | 2.2.3 | State Management |
| **React Router** | 6.22.3 | Client-side Routing |
| **Tailwind CSS** | 4.0.0 | Styling Framework |
| **Axios** | 1.6.8 | HTTP Client |
| **Monaco Editor** | 4.7.0 | Code Editor Component |
| **Recharts** | 2.12.3 | Data Visualization |
| **React Icons** | 4.12.0 | Icon Library |
| **React Hot Toast** | 2.4.1 | Notification System |

### Backend Technologies
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | Latest | Runtime Environment |
| **Express.js** | 5.2.1 | Web Framework |
| **TypeScript** | 5.9.3 | Type Safety |
| **Prisma ORM** | 7.3.0 | Database ORM |
| **PostgreSQL** | Latest | Primary Database |
| **JWT** | 9.0.3 | Authentication |
| **Bcrypt** | 5.1.1 | Password Hashing |
| **Winston** | 3.19.0 | Logging System |
| **Multer** | 2.0.2 | File Upload Handling |
| **CORS** | 2.8.6 | Cross-Origin Support |

### Development Tools
- **ESLint** - Code Linting
- **Prettier** - Code Formatting
- **Nodemon** - Auto-restart on changes
- **TSX** - TypeScript Execution
- **Prisma Studio** - Database GUI

---

## 📁 Project Structure

### Root Directory
```
cloud-project/
├── client/          # React Frontend Application
├── server/          # Express Backend Application
├── readme.md        # Team Collaboration Guide
└── package.json     # Root dependencies
```

### Client Structure (Frontend)
```
client/
├── src/
│   ├── admin/              # Admin Portal
│   │   ├── components/     # Admin-specific components
│   │   └── pages/          # Admin pages
│   ├── students/           # Student Portal
│   │   ├── components/     # Student components
│   │   └── pages/          # Student pages
│   ├── context/            # React Context Providers
│   ├── redux/              # Redux Store & Slices
│   ├── routes/             # Route Configurations
│   ├── types/              # TypeScript Definitions
│   ├── utils/              # Utility Functions
│   ├── hooks/              # Custom React Hooks
│   ├── data/               # Static Data
│   └── App.tsx             # Main App Component
├── public/                 # Static Assets
├── vite.config.ts          # Vite Configuration
├── tailwind.config.js      # Tailwind Configuration
└── package.json            # Frontend Dependencies
```

### Server Structure (Backend)
```
server/
├── src/
│   ├── modules/
│   │   ├── auth/                    # Authentication Module
│   │   ├── interview_experience/    # Interview Blog System
│   │   │   ├── blogs/               # Blog CRUD operations
│   │   │   ├── comments/            # Comment system
│   │   │   ├── reactions/           # Reaction system
│   │   │   └── admin/               # Admin controls
│   │   ├── problems/                # Coding Problems
│   │   ├── tests/                   # Test Management
│   │   ├── users/                   # User Management
│   │   ├── roles/                   # Role & Permissions
│   │   └── upload/                  # File Upload
│   ├── middlewares/         # Express Middlewares
│   ├── config/              # Configuration Files
│   ├── utils/               # Utility Functions
│   ├── types/               # TypeScript Definitions
│   ├── constants/           # Application Constants
│   └── server.ts            # Server Entry Point
├── prisma/
│   └── schema.prisma        # Database Schema
└── package.json             # Backend Dependencies
```

---

## 🗄️ Database Architecture

### Database: PostgreSQL with Prisma ORM

### Key Entities & Relationships

#### **1. User Management**
- `users` - Core user table
- `roles` - User roles (Student, Admin, Super Admin)
- `permissions` - Granular permissions
- `role_permissions` - Role-Permission mapping
- `login_logs` - Track login attempts
- `action_logs` - User activity tracking

#### **2. Educational System**
- `colleges` - College information
- `departments` - Department data
- `batches` - Year/batch information
- `student_profiles` - Extended student info
- `student_platform_profiles` - Coding platform links

#### **3. Problem & Test System**
- `problems` - Coding problems
- `testcases` - Problem test cases
- `modules` - Problem categorization
- `tests` - Test definitions
- `test_problems` - Test-Problem mapping
- `test_attempts` - Student test attempts
- `submissions` - Code submissions
- `programming_language` - Supported languages
- `plagarism_reports` - Plagiarism detection

#### **4. Interview Experience Platform**
- `blogs` - Interview experience posts
- `comments` - Blog comments (with nested replies)
- `tags` - Topic tags
- `blog_tags_mapping` - Blog-Tag relationships
- `vote_user_mapping` - Upvote/Downvote tracking
- `reactions` - Reaction types (emoji)
- `blog_reactions` - Blog reactions
- `comment_reactions` - Comment reactions
- `blog_files` - File attachments

#### **5. Gamification & Engagement**
- `daily_challenges` - Daily coding challenges
- `store_items` - Virtual store items
- `user_purchases` - User purchases
- `placements` - Student placement tracking
- User fields: `coins`, `streak`, `last_solved_date`

#### **6. External Opportunities**
- `hackathons` - Hackathon listings
- `opensource_issues` - Open source opportunities
- `user_hackathon_participation` - User participation
- `user_contributions` - Contribution tracking
- `user_bookmarks` - Saved items
- `user_preferences` - User preferences
- `api_cache` - External API caching
- `platform_sync_status` - Sync status tracking

### Total Tables: **40+ tables** with comprehensive relationships

---

## 🎯 Core Features Implemented

### 1. 🔐 Authentication & Authorization

**Features:**
- JWT-based authentication
- Bcrypt password hashing
- Role-based access control (RBAC)
- Permission-based authorization
- Login tracking and analytics
- Session management

**Roles:**
- Super Admin (full access)
- Admin (manage content & users)
- Student (access learning materials)

### 2. 📝 Interview Experience Sharing Platform

**User Features:**
- Create interview experience blogs
- Rich text descriptions
- Tag-based categorization (Amazon, Google, Microsoft, etc.)
- Upvote/Downvote system with toggle
- Comment on blog posts
- Nested comment replies (parent-child relationship)
- Emoji reactions on blogs and comments
- File attachments support
- Search and filter blogs
- Pagination support
- Delete own blogs/comments

**Admin Features:**
- View all blogs with user email
- Delete any blog/comment
- Monitor inappropriate content
- Search by user email
- Admin-only endpoints with middleware

**Technical Highlights:**
- Vote toggle logic (same vote removes, opposite switches)
- Optimized queries with Prisma
- Indexed database fields for performance
- Cascading deletes for data integrity

### 3. 💻 Coding Practice System

**Features:**
- Browse coding problems by difficulty (Easy, Medium, Hard)
- Problem categorization with modules
- Monaco code editor integration
- Multi-language support
- Test case validation
- Code submission tracking
- Submission history
- Runtime and memory tracking
- Daily coding challenges
- Problem bookmarking

**Supported Languages:**
- JavaScript
- Python
- Java
- C++
- And more (via programming_language table)

### 4. 📊 Test Management System

**Features:**
- Create and schedule tests
- Assign problems to tests
- Time-bound test execution
- Real-time test monitoring
- Submission tracking during tests
- Plagiarism detection
- Test result analytics
- Multiple test attempts
- Warning system for suspicious behavior
- Auto-blocking for violations

**Test Statuses:**
- NOT_SCHEDULED
- SCHEDULED
- LIVE
- COMPLETED
- CANCELLED

### 5. 👤 Student Profile Management

**Features:**
- Complete student profiles
- Department and batch tracking
- Mentor assignment
- Coding platform profile links (LeetCode, HackerRank, etc.)
- Profile edit controls
- Edit request system
- Profile completion tracking
- Placement tracking

**Platform Integrations:**
- LeetCode
- HackerRank
- CodeForces
- AtCoder
- Skillrack
- CodeChef

### 6. 🎮 Gamification System

**Features:**
- Coin system for achievements
- Daily streak tracking
- Leaderboard rankings
- Virtual store with items
- Achievement rewards
- Daily challenges
- Progress tracking

**Metrics Tracked:**
- Total coins earned
- Current streak
- Last solved date
- Problems solved
- Tests completed
- Interview experiences shared

### 7. 🌐 External Opportunities Hub

**Features:**
- Hackathon listings from multiple platforms
- Open source issue aggregation
- Bookmark opportunities
- Track participation status
- Set reminders
- Platform sync system
- API caching for performance
- View count tracking

**Supported Platforms:**
- Devpost
- MLH (Major League Hacking)
- GitHub
- GitLab
- And more...

### 8. 📤 File Upload System

**Features:**
- Secure file upload with Multer
- File validation
- Multiple file support
- File metadata tracking (size, MIME type)
- Blog attachment support
- S3/Cloud storage ready

### 9. 📈 Analytics & Monitoring

**Features:**
- Login attempt tracking
- User activity logs
- Action logging system
- Performance metrics
- Error logging with Winston
- Structured logging

---

## 🔌 API Architecture

### RESTful API Design

**Base URL:** `/api`

### API Modules

#### Authentication Module (`/api/auth`)
- POST `/login` - User login
- POST `/register` - User registration
- POST `/logout` - User logout
- GET `/profile` - Get user profile
- PUT `/profile` - Update profile

#### Blog Module (`/api/blogs`)
- GET `/blogs` - Get all blogs (paginated, searchable, filterable)
- GET `/blogs/:id` - Get blog by ID
- POST `/blogs` - Create new blog
- DELETE `/blogs/:id` - Delete own blog
- POST `/blogs/vote` - Upvote/Downvote blog
- GET `/blogs/:id/comments` - Get blog comments
- POST `/blogs/comments` - Add comment
- DELETE `/blogs/comments/:id` - Delete own comment

#### Tags Module (`/api/tags`)
- GET `/tags` - Get all tags

#### Admin Blog Module (`/api/admin`)
- GET `/admin/blogs` - Get all blogs (with email)
- DELETE `/admin/blogs/:id` - Delete any blog
- DELETE `/admin/comments/:id` - Delete any comment

#### Problems Module (`/api/problems`)
- CRUD operations for problems
- Test case management
- Module hierarchy management

#### Tests Module (`/api/tests`)
- Test creation and management
- Test scheduling
- Student test attempts
- Plagiarism reporting

#### Upload Module (`/api/upload`)
- File upload endpoints

### API Features
- JWT authentication on all protected routes
- Role-based middleware
- Permission checking
- Request validation
- Error handling middleware
- Structured responses
- Pagination support
- Search and filtering

**API Documentation:** See `client/api.md` for complete API specs

---

## 🎨 Frontend Architecture

### Component Structure

#### **Admin Portal**
**Pages:**
- `CreateProblemPage.tsx` - Problem creation interface
- `ProblemsPage.tsx` - Problem management
- `ProblemForm.tsx` - Problem editing form
- `InterviewExperianceAdmin.tsx` - Blog moderation

**Components:**
- `Layout.tsx` - Admin layout wrapper
- `DeleteConfirmationModal.tsx` - Confirmation dialogs
- `ProblemDrawer.tsx` - Problem details drawer
- `OneCompilerEmbed.tsx` - Code editor embed
- `CustomSelect.tsx` - Custom select component

#### **Student Portal**
**Pages:**
- `Dashboard.tsx` - Student dashboard
- `Problems.tsx` - Browse problems
- `ProblemDescription.tsx` - View problem details
- `ScheduledTests.tsx` - Upcoming tests
- `TakeTest.tsx` - Test-taking interface
- `CompletedTests.tsx` - Test history
- `TestResults.tsx` - View results
- `TestQuestions.tsx` - Test questions view
- `Submissions.tsx` - Submission history
- `Leaderboard.tsx` - Student rankings
- `InterviewExperiance.tsx` - Browse interview blogs

**Components:**
- `Layout.tsx` - Student layout wrapper
- `Navbar.tsx` - Navigation bar
- `Sidebar.tsx` - Side navigation
- `PageHeader.tsx` - Page headers
- `StudentProfile.tsx` - Profile display
- `SubmissionResult.tsx` - Submission results
- **Interview Experience Components:**
  - `AddBlogModel.tsx` - Blog creation modal
  - `BlogModel.tsx` - Blog detail modal
  - `CommentItem.tsx` - Comment display
  - `ReactionSelector.tsx` - Emoji reactions

### State Management

**Redux Toolkit Slices:**
- Authentication state
- User profile state
- Problem state
- Test state
- UI state

**React Context:**
- `AuthContext.tsx` - Authentication context
- `ThemeContext.tsx` - Theme management
- `ProblemContext.tsx` - Problem-specific state

### Custom Hooks
- Authentication hooks
- Data fetching hooks
- Form handling hooks

### Routing
- Protected routes
- Role-based routing
- Lazy loading
- Nested routes

---

## 🔒 Security Features

### 1. Authentication & Authorization
- JWT token-based auth
- Secure password hashing (bcrypt)
- Token expiration
- Role-based access control
- Permission-based endpoints

### 2. Data Protection
- SQL injection prevention (Prisma ORM)
- XSS protection
- CORS configuration
- Input validation
- Sanitization

### 3. File Upload Security
- File type validation
- File size limits
- Secure file storage
- MIME type checking

### 4. API Security
- Rate limiting ready
- Request validation
- Error message sanitization
- Secure headers
- HTTPS ready

### 5. Database Security
- Prepared statements (Prisma)
- Foreign key constraints
- Cascading deletes
- Indexed sensitive fields
- Connection pooling

### 6. Monitoring
- Login attempt tracking
- Failed login logging
- Action logging
- Error tracking

---

## 📊 Database Performance Optimizations

### Indexing Strategy
```sql
-- User lookups
idx_users_email

-- Submission queries
idx_submissions_user
idx_submissions_problem

-- Comment queries
idx_comments_blog_parent
idx_comments_parent_id
idx_comments_created_at

-- Test queries
idx_tests_status
idx_test_attempts_user

-- Reactions
idx_blog_reactions_blog_id
idx_blog_reactions_user_id
idx_blog_reactions_reaction_id
idx_comment_reactions_comment_id
```

### Query Optimizations
- Prisma select specific fields
- Pagination for large datasets
- Eager loading with `include`
- Lazy loading where appropriate
- Aggregate queries for stats

### Data Integrity
- Foreign key constraints
- Cascade deletes
- Unique constraints
- NOT NULL constraints
- Default values

---

## 🚀 Deployment & DevOps

### Development Scripts

**Client (Frontend):**
```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

**Server (Backend):**
```bash
npm run dev              # Start with nodemon
npm run build            # Compile TypeScript
npm start                # Production start
npm run typecheck        # Type checking
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run migrations
npm run prisma:studio    # Open Prisma Studio
npm run prisma:push      # Push schema to DB
```

### Environment Setup
- Environment variables for configuration
- Separate dev/prod configs
- Database connection strings
- JWT secrets
- File upload paths

### Build Process
- TypeScript compilation
- Vite bundling (client)
- Asset optimization
- Tree shaking
- Code splitting

---

## 👥 Team Collaboration

### Git Workflow

**Branching Strategy:**
- `main` - Production-ready code
- `dev` - Integration branch
- `feature/<name>-<feature>` - Feature branches
- `bugfix/<name>-<bug>` - Bug fix branches

**Key Practices:**
1. ❌ Never push directly to main
2. ✅ Always work on feature branches
3. ✅ Use Pull Requests for merging
4. ✅ Code review before merge
5. ✅ Pull latest changes before starting work

**Pull Request Process:**
1. Create feature branch
2. Make changes and commit
3. Push branch to GitHub
4. Create Pull Request
5. Get code review
6. Merge after approval

### Code Quality
- ESLint for linting
- TypeScript for type safety
- Prettier for formatting
- Code review guidelines
- Testing practices

---

## 📈 Metrics & Statistics

### Project Scale
- **Total Files:** 100+ TypeScript/TSX files
- **Database Tables:** 40+ tables
- **API Endpoints:** 50+ endpoints
- **Frontend Components:** 30+ React components
- **Backend Modules:** 7 major modules

### Lines of Code (Estimated)
- **Frontend:** ~5,000+ lines
- **Backend:** ~7,000+ lines
- **Database Schema:** ~600 lines
- **Total:** 12,000+ lines of code

---

## 🎓 Key Learning Outcomes

### Technical Skills Developed

1. **Full-Stack Development**
   - React with TypeScript
   - Node.js & Express
   - RESTful API design
   - Database modeling

2. **Modern Tools & Frameworks**
   - Vite build tool
   - Prisma ORM
   - Redux Toolkit
   - Tailwind CSS

3. **Software Engineering Practices**
   - Git collaboration
   - Code review
   - API documentation
   - Database design
   - Security best practices

4. **Problem Solving**
   - Complex data relationships
   - Performance optimization
   - State management
   - Authentication flows

---

## 🔮 Future Enhancements

### Planned Features
1. **Real-time Features**
   - WebSocket integration
   - Live code collaboration
   - Real-time notifications

2. **Advanced Analytics**
   - Detailed performance metrics
   - Progress visualization
   - Predictive analytics

3. **AI Integration**
   - Code suggestions
   - Automated code review
   - Smart problem recommendations

4. **Mobile Application**
   - React Native app
   - Mobile-optimized UI
   - Offline support

5. **Enhanced Gamification**
   - Badges and achievements
   - Team competitions
   - Advanced leaderboards

6. **External Integrations**
   - LeetCode API integration
   - GitHub OAuth
   - Slack notifications

---

## 📚 Documentation

### Available Documentation
1. **README.md** - Team collaboration guide
2. **api.md** - Complete API documentation
3. **schema.prisma** - Database schema with comments
4. **PROJECT_REPORT.md** - This comprehensive report

### Code Documentation
- TypeScript interfaces for type safety
- Inline comments for complex logic
- Function documentation
- API endpoint documentation

---

## 🏆 Project Highlights

### Technical Achievements
✅ **Modern Tech Stack** - Latest technologies and best practices  
✅ **Type Safety** - Full TypeScript implementation  
✅ **Scalable Architecture** - Modular and maintainable code  
✅ **Database Design** - Normalized schema with 40+ tables  
✅ **Security** - JWT auth, bcrypt, and RBAC  
✅ **Performance** - Indexed queries and optimizations  
✅ **User Experience** - Monaco editor, real-time features  
✅ **Comprehensive Features** - Interview blog, coding practice, tests  

### Business Value
✅ **Student Engagement** - Gamification and social features  
✅ **Interview Preparation** - Real interview experiences  
✅ **Skill Development** - Coding practice platform  
✅ **Assessment Tools** - Test management system  
✅ **Career Opportunities** - Hackathon and open source hub  
✅ **Progress Tracking** - Analytics and leaderboards  

---

## 🎯 Conclusion

This project represents a comprehensive **Full-Stack Educational Platform** that combines:

1. **Social Learning** - Interview experience sharing
2. **Technical Skills** - Coding practice and tests
3. **Career Development** - Opportunities and tracking
4. **Gamification** - Engagement and motivation
5. **Modern Technology** - Industry-standard tools

The platform is built with **scalability**, **security**, and **user experience** in mind, using modern best practices and a clean architecture that can support thousands of users.

---

## 📞 Project Information

**Repository:** St-Joseph-s-project/cloud-project  
**Project Type:** Educational Web Application  
**Primary Language:** TypeScript  
**Framework:** React (Frontend) + Express (Backend)  
**Database:** PostgreSQL  
**ORM:** Prisma  

---

*This report was generated on February 18, 2026*  
*For questions or clarifications, please contact the development team.*
