import express from "express";
import cors from "cors";
import "dotenv/config";
import http from "http";
import { connectDB } from "./config/db.ts";

const app = express();
const PORT = 5000;

//Database
await connectDB();
//Middlewares
app.use(cors());
app.use(express.json());

//Routes
app.get("/", (req, res) => {
  res.send("Hello World");
});

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
