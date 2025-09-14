# VPN Backoffice - Next.js Admin Panel

A comprehensive admin panel for VPN management built with Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui components. Fully integrated with all backend APIs for complete admin functionality.

## ✅ Complete Implementation

### 🔐 Authentication & Role-Based Access
- JWT-based admin authentication via `/api/v1/admin-auth/login`
- Role-based permissions (Admin vs Super Admin)
- Protected routes with automatic token validation
- Secure logout with token cleanup
- Role detection from login response

### 👥 VPN Users Management (`/vpn-users`)
**Integrated APIs:**
- `GET /api/v1/admin/vpn-users?page=1&limit=100` - Paginated user listing
- `GET /api/v1/admin/vpn-users/{id}` - User profile details
- `PATCH /api/v1/admin/vpn-users/{id}/status` - Toggle user status (Super Admin only)

**Features:**
- Searchable and filterable user table (active/inactive)
- Real-time status toggle switches (role-based)
- User detail modal with profile information
- Mobile-responsive design

### 👨💼 Admin Users Management (`/admin-users`)
**Integrated APIs:**
- `GET /api/v1/admin/admin-users` - List admin users
- `POST /api/v1/admin/create-admin-user` - Create admin user (Super Admin only)
- `DELETE /api/v1/admin/admin-users/{id}` - Delete admin user (Super Admin only)

**Features:**
- Create admin users with role assignment
- View admin user details and permissions
- Delete admin users (Super Admin only)
- Form validation with React Hook Form

### 💳 Subscription Plans (`/plans`)
**Integrated APIs:**
- `GET /api/v1/subscriptions/plans` - List all plans
- `POST /api/v1/subscriptions/plans` - Create new plan
- `PUT /api/v1/subscriptions/plans/{id}` - Update plan
- `DELETE /api/v1/subscriptions/plans/{id}` - Delete plan

**Features:**
- Full CRUD operations with form validation
- Plan creation/editing with features and pricing
- Confirmation modals for deletions
- Feature list management (comma-separated input)

### 🖥️ VPN Servers (`/servers`)
**Integrated APIs:**
- `GET /api/v1/admin/servers` - List all servers
- `POST /api/v1/admin/add_server` - Add new server with query parameters
- `PUT /api/v1/admin/servers/{id}` - Update server with query parameters
- `DELETE /api/v1/admin/servers/{id}` - Remove server

**Features:**
- Complete server management (hostname, location, endpoint, public_key, tunnel_ip, allowed_ips)
- Premium/free server classification
- Status management (active/inactive/maintenance)
- Max connections and current load tracking
- Role-based access control (Super Admin only)

### 📊 Analytics & Dashboard (`/analytics`, `/dashboard`)
**Integrated APIs:**
- `GET /api/v1/analytics/usage` - Usage statistics
- `GET /api/v1/analytics/performance` - Performance metrics

**Features:**
- Interactive charts with Recharts (bar/line charts)
- Real-time usage statistics and bandwidth tracking
- Server performance visualization
- Connection distribution per server
- Responsive dashboard cards with key metrics

### 🏥 System Health (`/health`)
**Integrated APIs:**
- `GET /api/v1/health/db` - Database health
- `GET /api/v1/health/cache` - Cache health
- `GET /api/v1/health/system` - System health

**Features:**
- Real-time health monitoring (30s auto-refresh)
- Visual status indicators (healthy/warning/error)
- Service-specific health cards
- Overall system status overview
- Last check timestamps

## 🔐 Role-Based Access Control

### **Admin Role (View-Only Access):**
- ✅ View VPN users, admin users, dashboard, analytics, health
- ❌ Cannot create/modify users or servers
- ❌ Cannot update user status or delete admin users

### **Super Admin Role (Full Access):**
- ✅ All Admin permissions plus full CRUD operations
- ✅ Create/delete admin users
- ✅ Update VPN user status
- ✅ Full system management

**Current Super Admin:** `admin` / `admin123` (role: `super_admin`)

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Button, Card, Table, Switch, Dialog, etc.)
- **State Management**: React Query (TanStack Query)
- **Charts**: Recharts
- **HTTP Client**: Axios with interceptors
- **Forms**: React Hook Form + Zod validation
- **Notifications**: Sonner

## Quick Start

### Prerequisites
- Node.js 18+ or Python 3.9+ (for virtual environment setup)
- Running VPN backend on port 8000

### One-Command Setup
```bash
# Complete setup with virtual environment
./start.sh
```

### Manual Setup
```bash
npm install
cp .env.example .env
npm run dev
```

### Access
- **URL**: [http://localhost:3000](http://localhost:3000)
- **Username**: `admin`
- **Password**: `admin123`

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── dashboard/         # Dashboard overview
│   ├── users/            # VPN users management
│   ├── admin-users/      # Admin users management
│   ├── plans/            # Subscription plans
│   ├── servers/          # VPN servers
│   ├── analytics/        # Charts & analytics
│   ├── health/           # System health
│   └── login/            # Authentication
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── layout/           # Layout components (Sidebar, DashboardLayout)
│   └── providers/        # React Query provider
├── lib/
│   ├── api.ts           # Axios configuration with auth
│   ├── types.ts         # TypeScript interfaces
│   └── utils.ts         # Utility functions
├── hooks/
│   ├── use-auth.ts      # Authentication hook
│   └── use-role.ts      # Role-based access control
└── docker/              # Docker configuration
```

## Key Features

### 🛠️ Error Handling & UX
- Global API error interceptors with user-friendly messages
- Loading states for all async operations
- Optimistic updates with rollback on errors
- Form validation with real-time feedback
- Mobile-responsive design

### 🔄 Real-time Features
- Auto-refresh for health monitoring
- React Query cache invalidation
- Optimistic updates for user actions
- Real-time status indicators

### 🐳 Production Ready
- Optimized Docker build with multi-stage
- Standalone Next.js output
- Environment variable configuration
- Multiple deployment scripts

## Deployment Options

### 1. One-Command Start
```bash
./start.sh  # Handles venv, dependencies, Docker/Node.js
```

### 2. Development
```bash
./deploy.sh  # Quick development setup
npm run dev
```

### 3. Production
```bash
./prod.sh    # Production build
npm run build && npm start
```

### 4. Docker
```bash
./docker-run.sh  # Docker deployment
# Or manually:
docker build -f docker/Dockerfile -t vpn-backoffice .
docker run -p 3000:3000 vpn-backoffice
```

## Environment Variables

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

## API Integration Status

✅ **All 20+ Backend APIs Fully Integrated:**
- Admin authentication (`/api/v1/admin-auth/login`) - Username/password with role detection
- VPN users management (`/api/v1/admin/vpn-users?page=1&limit=100`, `/api/v1/admin/vpn-users/{id}`, `/api/v1/admin/vpn-users/{id}/status`)
- Admin users management (`/api/v1/admin/admin-users`, `/api/v1/admin/create-admin-user`, `/api/v1/admin/admin-users/{id}`)
- VPN servers management (`/api/v1/admin/servers`, `/api/v1/admin/add_server`, `/api/v1/admin/servers/{id}`)
- Subscription plans CRUD operations (`/api/v1/subscriptions/plans/*`)
- Analytics and performance metrics (`/api/v1/analytics/*`)
- System health monitoring (`/api/v1/health/*`)

## Security Features

- JWT token-based authentication
- Role-based access control (RBAC)
- Protected API routes
- Input validation and sanitization
- Secure logout with token cleanup
- CORS handling

## Requirements Fulfilled

✅ Separate VPN Users and Admin Users management  
✅ Role-based permissions (Admin vs Super Admin)  
✅ User Management with search, filters, and status toggles  
✅ Admin Users Management with role-based access control  
✅ Subscription Plans CRUD with validation  
✅ VPN Servers management with complete field support  
✅ Analytics dashboard with interactive charts  
✅ System Health monitoring with real-time updates  
✅ Next.js 14 with App Router and TypeScript  
✅ React Query for API state management  
✅ shadcn/ui components for consistent UX  
✅ Authentication and error handling  
✅ Loading states and responsive design  
✅ Docker deployment configuration  

The application is production-ready and fully functional at `localhost:3000` with the backend running on `localhost:8000`.

## License

MIT