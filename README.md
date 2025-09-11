# VPN Backoffice

A modern, production-ready web-based backoffice for Prime VPN.

- Frontend: React 18 + TypeScript + Vite
- UI: Material UI (MUI)
- State: Redux Toolkit
- Charts: Recharts
- Auth: JWT via VPN-backend, admin-only gate
- Container: Docker (Nginx serving static build)

## Features

- Admin-only login (checks backend admin endpoint)
- Dashboard shell and layout (ready to extend)
- Users page (search user by email via backend API)
- API client with token interceptor
- Production Docker image with Nginx reverse-proxy for `/api`

## Requirements

- Node.js >= 18
- npm or yarn or pnpm
- A running VPN backend with CORS allowing this origin
- Admin user available in backend (default demo user shown below)

## Environment Variables

Create a `.env` file in the repo root:

```
VITE_API_BASE_URL=http://localhost:8000
```

- `VITE_API_BASE_URL`: FastAPI backend base URL.

## Local Development

```
# 1) Install dependencies
npm install

# 2) Run dev server
npm run dev
# App: http://localhost:5173
```

## Admin Login

The backoffice requires an admin account. The login flow:
1) POST `/api/v1/auth/login` to obtain a JWT access token
2) Immediately call `/api/v1/admin/rate-limits/config` to verify admin access

If your backend seeds a default admin, you can use:
- username: `admin`
- password: `admin`

Note: If your backend differs, update credentials accordingly.

## API Endpoints Used

- Auth: `POST /api/v1/auth/login`
- Admin Check: `GET /api/v1/admin/rate-limits/config`
- Users: `GET /api/v1/users/profile?email=user@example.com`

Make sure these exist and CORS allows the backoffice origin.

## Build (Static Production)

```
# Build static assets to dist/
npm run build

# Preview locally
npm run preview
```

## Docker (Backoffice Only)

This repository includes a production container using Nginx to serve the static build and proxy `/api` to a backend service name `backend` on port `8000`.

```
# Build image
docker build -f docker/Dockerfile -t vpn-backoffice .

# Run container (backend reachable at VITE_API_BASE_URL OR via compose)
docker run -p 3000:80 -e VITE_API_BASE_URL=http://localhost:8000 vpn-backoffice
```

Nginx config (docker/nginx.conf):
- Serves SPA (fallback to `/index.html`)
- Proxies `/api/` to `http://backend:8000` when using docker-compose

## Docker Compose (Backoffice + Backend)

If you already have a backend image tagged `vpn-backend:latest`, you can run both:

```
cd docker
# Ensure DATABASE_URL, REDIS_URL, JWT_SECRET are exported or in an .env file
docker compose up --build
# Backoffice: http://localhost:3000
# Backend:    http://localhost:8000
```

docker/docker-compose.yml expects:
- backoffice: builds this repo and serves static files via Nginx
- backend: uses `vpn-backend:latest` image

Update the compose file if your backend image/tag or env differ.

## Project Structure

```
.
├── docker/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── docker-compose.yml
├── public/
├── src/
│   ├── components/
│   │   └── layout/
│   ├── pages/
│   │   ├── Auth/Login.tsx
│   │   ├── Dashboard.tsx
│   │   └── Users/UserList.tsx
│   ├── services/
│   │   ├── api.ts
│   │   └── userService.ts
│   ├── store/
│   │   ├── authSlice.ts
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── theme.ts
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## Deployment

You can deploy the static build (`dist/`) to any static host (S3 + CloudFront, Netlify, Vercel, etc.). Ensure:
- The hosting platform supports SPA routing (fallback to `index.html`).
- `/api` requests are proxied to your backend (via platform rewrites/proxies) or set `VITE_API_BASE_URL` for absolute calls.

### Nginx (Bare Metal / VM)

- Use the provided `docker/nginx.conf` as a template.
- Ensure the `location /api/` block points to your backend URL.
- Serve `dist/` directory and enable SPA fallback.

## CI (Optional)

- Build on push to `main`:
  - `npm ci && npm run build`
  - Publish `dist/` as artifact or deploy to your host

## Troubleshooting

- 401 after login: The admin check (`/api/v1/admin/rate-limits/config`) likely failed. Verify the user is admin and the token is valid.
- CORS errors: Add the backoffice origin to `ALLOWED_ORIGINS` in backend settings.
- Blank page on refresh in production: Ensure SPA fallback to `index.html` is configured.

## License

MIT
