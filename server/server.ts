import express from "express";

import cors from "cors";

import "dotenv/config";

import http from "http";

import { authRouter, userRouter } from "#routes";

import { connectDB } from "./config/db.ts";

const app = express();
const PORT = 5000;

//Database
await connectDB();
//Middlewares
app.use(cors());
app.use(express.json({ limit: "10kb" }));

//Routes
// Forgot password
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);

app.get("/", (req, res) => {
  res.send("Hello World");
});

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
