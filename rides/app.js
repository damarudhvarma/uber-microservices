import express from 'express';
import {  rideRouter } from './routes/rideRoutes.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectToDB } from './DB/connect.js';
import { connect } from './service/rabbit.js';

const app = express();
dotenv.config();



app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.use("/",rideRouter);
connectToDB()
connect();

export { app };


