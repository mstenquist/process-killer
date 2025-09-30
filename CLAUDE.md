# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start Vite dev server on port 3000 (React frontend with hot reload)
- `npm run server` - Start Express API server on port 8080
- `npm run server:dev` - Start Express server with nodemon for auto-restart
- `npm run build` - Build React app for production (outputs to dist/)
- `npm run preview` - Preview production build locally
- `npm install` - Install dependencies

### Typical Development Workflow
1. Run `npm run server:dev` in one terminal (starts API server on :8080)
2. Run `npm run dev` in another terminal (starts React dev server on :3000)
3. Access the app at http://localhost:3000 (Vite proxies API calls to :8080)

### Production
1. Run `npm run build` to create production build in dist/
2. Run `npm run server` to serve the built app and API on port 8080

## Architecture

React + Vite frontend with Node.js/Express backend for monitoring and killing processes on development ports.

### Core Components

1. **Backend (server.js)**
   - Express server running on port 8080
   - Monitors ports: 3000-3005, 5173-5175, 8080, 9000-9005
   - Uses `lsof` and `ps` commands to check port usage
   - Uses `kill -9` to terminate processes
   - API endpoints:
     - `GET /api/ports` - Returns status of all monitored ports
     - `POST /api/kill/:pid` - Kills a process by PID
   - Serves built React app from dist/ in production

2. **Frontend (src/)**
   - React 18 with Vite build tool
   - `src/main.jsx` - React entry point
   - `src/App.jsx` - Main component with state management (ports, auto-refresh)
   - `src/App.css` - All styles
   - Features auto-refresh toggle (5-second interval)
   - Shows port statistics and active processes
   - PortCard component handles individual port display and kill actions

3. **Configuration**
   - `vite.config.js` - Vite configuration with proxy to backend API
   - `index.html` - HTML entry point for Vite
   - `package.json` - Uses ES modules (`"type": "module"`)

### Key Technical Details

- The app relies on system commands (`lsof`, `ps`, `kill`) which are macOS/Linux specific
- Port list is hardcoded in `PORTS_TO_MONITOR` array in server.js
- Vite dev server proxies `/api/*` requests to Express server on port 8080
- CORS is enabled for API access
- React uses hooks (useState, useEffect) for state management