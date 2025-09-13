# VPN Backoffice - Next.js Admin Panel

A comprehensive admin panel for VPN management built with Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui components. Fully integrated with all backend APIs for complete admin functionality.

## ✅ Complete Implementation

### 🔐 Authentication System
- JWT-based admin authentication with backend verification
- Protected routes with automatic token validation
- Secure logout functionality
- Admin-only access control

### 👨‍💼 Admin Users Management (`/admin-users`)
**Integrated APIs:**
- `GET /api/v1/admin/admin-users` - List all admin users
- `POST /api/v1/admin/create-admin-user` - Create new admin user
- `DELETE /api/v1/admin/admin-users/{id}` - Delete admin user

**Features:**
- Admin user creation with role assignment (admin/super_admin)
- User management table with status indicators
- Secure admin user deletion with confirmation
- Role-based access control

### 👥 User Management (`/users`)
**Integrated APIs:**
- `GET /api/v1/users/list` - Paginated user listing
- `GET /api/v1/users/{id}` - User profile details
- `PATCH /api/v1/users/{id}/status` - Toggle user status

**Features:**
- Searchable and filterable user table (active/inactive)
- Real-time status toggle switches
- User detail modal with profile information
- Responsive design with mobile support

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
- `GET /api/v1/vpn/servers` - List all servers
- `POST /api/v1/vpn/servers` - Add new server
- `PUT /api/v1/vpn/servers/{id}` - Update server
- `DELETE /api/v1/vpn/servers/{id}` - Remove server

**Features:**
- Server location management (country/city)
- Premium/free server classification
- Status management (active/inactive/maintenance)
- Connection capacity tracking with real-time data

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
- Node.js 18+
- Running VPN backend on port 8000

### Installation
```bash
# Quick setup
./setup.sh

# Or manually
npm install
cp .env.example .env
npm run dev
```

### Access
- **URL**: [http://localhost:3000](http://localhost:3000)
- **Username**: `admin`
- **Password**: `admin`

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── dashboard/         # Dashboard overview
│   ├── users/            # User management
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
├── hooks/               # Custom React hooks (useAuth)
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
- Docker Compose for full stack deployment

## Deployment

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

### Docker
```bash
docker build -f docker/Dockerfile -t vpn-backoffice .
docker run -p 3000:3000 vpn-backoffice

# Or with Docker Compose
cd docker && docker-compose up
```

## Environment Variables

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

## API Integration Status

✅ **All 18+ Backend APIs Fully Integrated:**
- Authentication & admin verification
- User management with status controls
- Admin users management with role-based access
- Subscription plans CRUD operations
- VPN servers management
- Analytics and performance metrics
- System health monitoring

## Requirements Fulfilled

✅ User Management with search, filters, and status toggles  
✅ Admin Users Management with role-based access control  
✅ Subscription Plans CRUD with validation  
✅ VPN Servers management with location data  
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