# 🏠 HomiePlace

> **Find a place with your homies** — A modern full-stack web application designed for shared housing, room finding, and roommate collaboration with real-time messaging.

---

## 🚀 Tech Stack

### Frontend (`client/`)
- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Tooling**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (`@tailwindcss/vite`)
- **Routing**: [React Router DOM v7](https://reactrouter.com/)
- **Linting**: ESLint

### Backend (`server/`)
- **Runtime**: [Node.js](https://nodejs.org/) (ES Modules)
- **Framework**: [Express 5](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Real-Time Communication**: [Socket.io](https://socket.io/)
- **Authentication**: JWT ([jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)) & [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
- **Media Uploads**: [Multer](https://github.com/expressjs/multer), [Streamifier](https://github.com/epeli/node-streamifier), & [Cloudinary](https://cloudinary.com/)

---

## 📁 Project Structure

```text
HomiePlace/
├── client/                     # Frontend (React 19 + TypeScript + Vite + Tailwind v4)
│   ├── public/                 # Static public assets
│   ├── src/
│   │   ├── assets/             # Images and visual resources
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Page views
│   │   ├── context/            # React context providers (Auth, Socket)
│   │   ├── hooks/              # Custom React hooks
│   │   ├── services/           # API and HTTP service helpers
│   │   ├── types/              # TypeScript declarations
│   │   ├── App.tsx             # Root component & routing
│   │   ├── index.css           # Global Tailwind CSS
│   │   └── main.tsx            # Application entry point
│   ├── package.json
│   └── vite.config.ts
│
├── server/                     # Backend (Node.js ESM + Express 5 + Socket.io + MongoDB)
│   ├── config/                 # Database & Cloudinary configurations
│   ├── controllers/            # Route handlers & business logic
│   ├── middlewares/            # Auth JWT, error handling, Multer upload
│   ├── models/                 # Mongoose schemas
│   ├── routes/                 # Express API endpoints
│   ├── sockets/                # Real-time Socket.io event listeners
│   ├── server.js               # Express application entry point
│   └── package.json
│
├── .agent/                     # AI assistant instructions & architecture docs
├── AGENTS.md                   # Universal AI agent guidelines
├── .gitignore                  # Monorepo ignore rules
└── README.md                   # Project documentation
```

---

## 🛠️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas)
- npm or yarn

---

### 1. Clone & Setup

```bash
git clone <repository-url>
cd HomiePlace
```

---

### 2. Backend Setup (`server/`)

1. Navigate to the server folder and install dependencies:
   ```bash
   cd server
   npm install
   ```

2. Create an environment file `.env` inside `server/`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/homieplace
   JWT_SECRET=your_jwt_secret_key_here
   CLIENT_URL=http://localhost:5173

   # Cloudinary (Optional, for image uploads)
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

3. Start the backend development server:
   ```bash
   npm start
   ```
   The backend will be running at `http://localhost:5000`.

---

### 3. Frontend Setup (`client/`)

1. Open a new terminal, navigate to the client folder and install dependencies:
   ```bash
   cd client
   npm install
   ```

2. Create an environment file `.env` inside `client/`:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   VITE_SOCKET_URL=http://localhost:5000
   ```

3. Start the frontend development server:
   ```bash
   npm run dev
   ```
   The frontend will be accessible at `http://localhost:5173`.

---

## 📜 Available Scripts

### Client (`client/`)
| Command | Description |
| :--- | :--- |
| `npm run dev` | Runs the Vite development server with HMR |
| `npm run build` | Typechecks with `tsc` and compiles production assets |
| `npm run preview` | Locally previews production build |
| `npm run lint` | Runs ESLint to check for code quality issues |

### Server (`server/`)
| Command | Description |
| :--- | :--- |
| `npm start` | Runs the Express server with Nodemon auto-restart |

---

## 🤖 AI Agent & Contributor Guidelines

This repository contains preloaded guidelines for AI coding assistants (ChatGPT, Claude, Cursor, Copilot, Gemini):
- Master rules are located in [`.agent/README.md`](.agent/README.md)
- Universal agent entry point: [`AGENTS.md`](AGENTS.md)
- Never commit `node_modules` or `.env` credential files.

---

## 📄 License

This project is licensed under the ISC License.
