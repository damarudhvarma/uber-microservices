import { Router } from "express";
import { capAuth, userAuth } from "../middlewares/authMiddleware.js";
import { acceptRide, createRide } from "../controllers/rideController.js";


export const rideRouter= Router();


rideRouter.post("/create",userAuth,createRide);
rideRouter.put("/accept-ride",capAuth,acceptRide);

