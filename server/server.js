import express from 'express'
import cors from 'cors'
import 'dotenv/config';

const app = express();
const PORT = 5000;


//Middlewares
app.use(cors());
app.use(express.json());
