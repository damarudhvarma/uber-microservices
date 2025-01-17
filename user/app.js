import express from 'express';
import { userRouter } from './routes/userRoutes.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectToDB } from './DB/connect.js';
import { connect } from '../rides/service/rabbit.js';



const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
dotenv.config();
app.use("/",userRouter);
connectToDB()
connect();

export { app };


