# MutualFund Pro Full-Stack Setup

This workspace now runs as a connected full-stack model:

- Frontend: React + Vite (`/` root folder)
- Backend: Spring Boot + MySQL (`invest-mutual-funds-backend/mutual-fund-backend`)

## 1) Start MySQL

Create the database:

```sql
CREATE DATABASE mutualfunds;
```

By default, backend configuration uses:

- username: `root`
- password: `root`

Update `application.properties` if your local credentials are different.

## 2) Run Spring Boot backend

From `invest-mutual-funds-backend/mutual-fund-backend`:

```powershell
./mvnw.cmd spring-boot:run
```

Backend runs on `http://localhost:8080`.

## 3) Run React frontend

From the project root:

```powershell
npm install
npm run dev
```

Frontend runs on `http://localhost:5173` and uses Vite proxy to call backend `/api` endpoints.

## Seeded users (auto-created)

On backend startup, the app seeds default role accounts if they do not already exist:

- Admin: `admin@mfpro.com` / `admin123`
- Advisor: `advisor@mfpro.com` / `advisor123`
- Analyst: `analyst@mfpro.com` / `analyst123`

You can register new Investor accounts from the frontend Register page.

## What is connected now

- Authentication (register/login) with JWT
- Investor funds list and fund detail from backend
- Real investments and portfolio from backend
- Investor profile read/update from backend
- Investor -> Advisor query flow from backend
- Advisor query replies from backend
- Advisor educational content create/update from backend
- Admin users dashboard and status toggling from backend
- Admin fund management create/update/NAV update from backend
- Analyst reports create/list from backend

## Helpful backend API docs

- Swagger UI: `http://localhost:8080/swagger-ui.html`
