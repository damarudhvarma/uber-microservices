import express from 'express';
import { captainRouter } from './routes/captainRoutes.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectToDB } from './DB/connect.js';
import { connect } from './service/rabbit.js';

dotenv.config();


const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());


app.use("/",captainRouter);
connectToDB()

connect();

export { app };


