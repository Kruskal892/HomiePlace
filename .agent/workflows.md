# Workflows & Git Guidelines

## 1. Running the Project

### Client (Frontend)

```bash
# In client/
npm install
npm run dev        # Starts Vite dev server on http://localhost:5173
npm run build      # Typechecks and builds for production
npm run lint       # Runs ESLint
```

### Server (Backend)

```bash
# In server/
npm install
npm start          # Starts server with nodemon on http://localhost:5000
```

---

## 2. Environment Variables

### Security Rule

- **NEVER** commit `.env` files.
- Always provide template variables in `.env.example` in both `client/` and `server/`.

### Server Variables (`server/.env.example`)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/homieplace
JWT_SECRET=your_jwt_secret_key_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLIENT_URL=http://localhost:5173
```

### Client Variables (`client/.env.example`)

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

---

## 3. Git Commit Rules

- **Format**: `<type>: <short description>`
  - `feat: add user authentication controller and routes`
  - `fix: resolve socket reconnection issue on page refresh`
  - `refactor: extract navbar into reusable component`
  - `chore: update dependencies`
- **Verification before commit**:
  - Check `git status` to ensure only intended files are staged.
  - Verify that no `node_modules/`, `.env`, or build artifacts (`dist/`) are staged.
