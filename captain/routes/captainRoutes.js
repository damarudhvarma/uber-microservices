import { Router } from "express";
import { login, logout, profile, register, toggleAvailability, waitForNewRide } from "../controllers/captainController.js";
import { captainAuth } from "../middlewares/authMiddleware.js";


export const captainRouter= Router();


captainRouter.post("/register",register); 
captainRouter.post("/login",login);
captainRouter.get("/logout",logout);
captainRouter.get('/profile',captainAuth,profile);
captainRouter.patch('/toogle-availability',captainAuth,toggleAvailability);
captainRouter.get('/new-ride',captainAuth,waitForNewRide);
