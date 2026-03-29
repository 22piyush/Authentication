import express from "express";
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import cors from "cors";

export const app = express();
dotenv.config();
const port = process.env.PORT;
app.use(cors());



app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

