import { Router } from "express";
import { acceptedRide, login, logout, profile, register } from "../controllers/userController.js";
import { userAuth } from "../middlewares/authMiddleware.js";


export const userRouter= Router();


userRouter.post("/register",register); 
userRouter.post("/login",login);
userRouter.get("/logout",logout);
userRouter.get('/profile',userAuth,profile);
userRouter.get('/accepted-ride',userAuth,acceptedRide);
