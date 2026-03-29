import express from "express";
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from './config/database.js';
import { errorMiddleware } from "./middlewares/error.js";

export const app = express();
dotenv.config();
const port = process.env.PORT;
app.use(cors());



app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
// connect DB
connectDB();

app.use(errorMiddleware)

