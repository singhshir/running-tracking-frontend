# Real-Time Running Tracker — Frontend

A React 19 + Vite + Tailwind CSS frontend for a college final-year project.
It talks to the companion Express.js + MongoDB backend
(`real-time-running-tracker-backend`) over REST APIs, and uses
React Leaflet + OpenStreetMap for live GPS route tracking.

---

## Table of Contents

1. [Folder Structure](#1-folder-structure)
2. [Required npm Packages](#2-required-npm-packages)
3. [Installation Steps](#3-installation-steps)
4. [How to Run the Project](#4-how-to-run-the-project)
5. [API Integration Guide](#5-api-integration-guide)
6. [Code Explanation](#6-code-explanation)
7. [Future Improvements](#7-future-improvements)

---

## 1. Folder Structure

```
frontend/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env.example
└── src/
    ├── main.jsx                 # App entry point (Router, AuthProvider, Toasts)
    ├── App.jsx                  # Route table
    ├── index.css                # Tailwind + Leaflet global styles
    ├── api/
    │   ├── axiosInstance.js     # Pre-configured axios instance + interceptors
    │   ├── authApi.js           # /api/auth/* calls
    │   ├── runApi.js            # /api/runs/* calls
    │   └── userApi.js           # /api/users/* calls
    ├── context/
    │   └── AuthContext.jsx      # Global auth state (user, token, actions)
    ├── hooks/
    │   ├── useAuth.js           # Reads AuthContext
    │   ├── useLocation.js       # Wraps navigator.geolocation
    │   └── useRunTracker.js     # Full run state machine (start/pause/stop)
    ├── routes/
    │   └── ProtectedRoute.jsx   # Redirects to /login if not authenticated
    ├── layout/
    │   ├── Navbar.jsx
    │   ├── Sidebar.jsx
    │   ├── Footer.jsx
    │   └── DashboardLayout.jsx  # Navbar + Sidebar + <Outlet /> + Footer
    ├── components/
    │   ├── Button.jsx
    │   ├── Input.jsx
    │   ├── Loader.jsx
    │   ├── Modal.jsx
    │   ├── EmptyState.jsx
    │   ├── ErrorMessage.jsx
    │   ├── StatsCard.jsx
    │   ├── RunCard.jsx
    │   ├── MapView.jsx          # Leaflet map + live route + marker
    │   └── RunControls.jsx      # Live stats panel + Start/Pause/Stop buttons
    ├── pages/
    │   ├── Login.jsx
    │   ├── Register.jsx
    │   ├── Dashboard.jsx
    │   ├── StartRun.jsx         # The core live-tracking page
    │   ├── RunHistory.jsx
    │   ├── RunDetails.jsx
    │   ├── Statistics.jsx
    │   ├── Profile.jsx
    │   └── NotFound.jsx
    └── utils/
        ├── formatters.js        # Duration/distance/pace/date formatting
        └── geo.js               # Haversine distance, pace, calories (mirrors backend)
```

## 2. Required npm Packages

**Runtime:**
- react, react-dom (v19)
- react-router-dom
- axios
- leaflet, react-leaflet (v5, required for React 19 support)
- react-icons
- react-toastify
- recharts

**Dev:**
- vite, @vitejs/plugin-react
- tailwindcss, postcss, autoprefixer
- @types/react, @types/react-dom

All of these are already listed in `package.json` — you don't need to
install them one by one.

## 3. Installation Steps

```bash
cd frontend
npm install
```

That single command pulls in everything listed above.

## 4. How to Run the Project

### Step 1 — Run the backend first
From the backend folder:
```bash
npm install
npm run dev
```
By default it runs on **http://localhost:5000** and expects
`CLIENT_URL=http://localhost:3000` in its `.env` (the default already
matches this frontend).

### Step 2 — Run the frontend
```bash
npm run dev
```
This starts Vite on **http://localhost:3000**. `vite.config.js` proxies
any request to `/api/*` straight to `http://localhost:5000/api/*`, so the
browser only ever talks to one origin (no CORS/cookie headaches) and the
frontend code never hardcodes the backend port.

### Step 3 — Build for production
```bash
npm run build   # outputs to dist/
npm run preview # preview the production build locally
```
If you deploy the backend separately, set `VITE_API_BASE_URL` in a `.env`
file to the deployed backend's full `/api` URL before building — see
`.env.example`.

### A note on location permissions
The **Start Run** page needs the browser's location permission. Use
`localhost` (not a raw IP) or HTTPS in production — browsers block
`navigator.geolocation` on insecure, non-localhost origins.

## 5. API Integration Guide

Every backend response follows the shape `{ success, message, data }`
(see `backend/utils/responseHandler.js`). The API layer in `src/api/`
mirrors the backend's routes 1:1:

| Frontend function | Method & Route | Notes |
|---|---|---|
| `registerUser` | `POST /api/auth/register` | Returns `{ user, token }` |
| `loginUser` | `POST /api/auth/login` | Returns `{ user, token }` |
| `fetchProfile` | `GET /api/auth/profile` | Requires auth |
| `updateProfile` | `PUT /api/auth/profile` | name/email/height/weight/age/gender |
| `logoutUser` | `POST /api/auth/logout` | Clears the httpOnly cookie server-side |
| `startRun` | `POST /api/runs/start` | Returns `{ runId, run }` |
| `addLocation` | `POST /api/runs/location` | `{ runId, latitude, longitude, timestamp }` |
| `stopRun` | `POST /api/runs/stop` | `{ runId }` → final calculated run |
| `fetchRuns` | `GET /api/runs` | All of the user's runs, newest first |
| `fetchRunById` | `GET /api/runs/:id` | Full run incl. route |
| `deleteRun` | `DELETE /api/runs/:id` | |
| `fetchStatistics` | `GET /api/runs/statistics` | Aggregates across completed runs |

**Auth strategy:** the backend accepts a JWT either as an httpOnly cookie
or as a `Bearer` header. This frontend stores the token in `localStorage`
and attaches it via an axios request interceptor
(`src/api/axiosInstance.js`), which is simpler to reason about across
dev/prod than relying purely on cookies. A response interceptor watches
for `401`s and automatically logs the user out.

**Swapping in a real backend URL:** everything routes through
`axiosInstance`'s `baseURL`, which reads `import.meta.env.VITE_API_BASE_URL`
(defaulting to `/api`, which the dev proxy handles). To point at a
different backend, you only need to change `.env`  — no component code
needs to change.

## 6. Code Explanation

- **`useRunTracker`** is the heart of the app. It's a state machine with
  states `idle → active → paused ⇄ active → stopped`. While `active`, it
  listens to `useLocation`'s GPS stream, appends points to a local route
  array (for the live map), and throttles `POST /api/runs/location` calls
  to roughly once every 5 seconds so it doesn't spam the backend on every
  GPS tick. Only `Stop` calls `POST /api/runs/stop`, since the backend's
  `Run` model only has `active`/`completed`/`cancelled` states — pausing
  is a purely frontend concept.
- **Live stats vs. saved stats:** `src/utils/geo.js` is a deliberate 1:1
  port of the backend's Haversine distance, pace, and MET-based calorie
  formulas, so the numbers shown live on the Start Run page match what
  the backend calculates and saves once you hit Stop.
- **`AuthContext`** restores a session on page refresh by calling
  `GET /api/auth/profile` if a token is found in `localStorage`.
- **`ProtectedRoute`** wraps every authenticated page; unauthenticated
  users are bounced to `/login` and returned to where they were headed
  after logging back in.
- **Service layer:** no component calls `axios` directly — everything
  goes through `api/authApi.js`, `api/runApi.js`, `api/userApi.js`, so
  swapping HTTP libraries or endpoints later only touches one layer.

## 7. Future Improvements

- Offline support: queue GPS points in IndexedDB when the network drops
  mid-run and flush them once connectivity returns.
- Social features: following other runners, leaderboards.
- Route replay animation on the Run Details page.
- Push notifications / PWA install support for a more native mobile feel.
- Unit tests for `utils/geo.js` and `useRunTracker` (the riskiest logic).
- Dark mode.
