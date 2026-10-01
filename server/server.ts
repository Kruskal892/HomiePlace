import express from "express";
import cors from "cors";
import "dotenv/config";
import http from "http";
import { connectDB } from "./config/db.ts";
import { forgotPassword, registerUser, resetPassword } from "./controller/auth.controller.ts";

const app = express();
const PORT = 5000;

//Database
await connectDB();
//Middlewares
app.use(cors());
app.use(express.json({ limit: "10kb" }));

//Routes
app.post("/api/auth/forgot-password", forgotPassword);
app.post("/api/auth/reset-password/:token", resetPassword);
app.post("/api/auth/register", registerUser);
app.get("/", (req, res) => {
  res.send("Hello World");
});

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
