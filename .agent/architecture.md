# HomiePlace Architecture

## 1. Overview

HomiePlace is structured as a two-tier workspace:

```
HomiePlace/
├── client/                     # Frontend Application
│   ├── src/
│   │   ├── assets/             # Static visual assets (images, svg)
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Routed view components
│   │   ├── context/            # React context providers (Auth, Socket, etc.)
│   │   ├── hooks/              # Custom React hooks
│   │   ├── services/           # API and HTTP service calls (fetch / axios)
│   │   ├── types/              # TypeScript interface & type declarations
│   │   ├── App.tsx             # Root application component with routing
│   │   ├── index.css           # Global CSS & Tailwind imports
│   │   └── main.tsx            # React DOM entry point
│   ├── index.html              # HTML shell
│   ├── package.json            # Client dependencies
│   ├── tsconfig.json           # TypeScript configuration
│   └── vite.config.ts          # Vite build config with Tailwind plugin
│
├── server/                     # Backend Application
│   ├── config/                 # DB connection (MongoDB/Mongoose), Cloudinary config
│   ├── controllers/            # Request handlers & business logic
│   ├── middlewares/            # Auth JWT verification, file upload (Multer), error handlers
│   ├── models/                 # Mongoose schemas & data models
│   ├── routes/                 # Express route definitions
│   ├── sockets/                # Socket.io event handlers & real-time messaging
│   ├── utils/                  # Helper functions
│   ├── server.js               # Express app bootstrap & Socket.io server listener
│   └── package.json            # Server dependencies
│
├── .agent/                     # Agent instructions & preload content
├── .gitignore                  # Git ignore rules for root, client, and server
└── AGENTS.md                   # Universal entry point for AI assistants
```

---

## 2. Ports & Networking

- **Client**: Typically runs on `http://localhost:5173` (Vite default).
- **Server**: Runs on `http://localhost:5000` (configurable via `PORT` in `.env`).
- **CORS**: Express server uses `cors()` to accept requests from the client.
- **Real-Time WebSockets**: Socket.io server attaches to the HTTP server instance on port 5000.
