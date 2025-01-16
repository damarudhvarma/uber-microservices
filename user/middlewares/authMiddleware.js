import { userModel } from "../models/userModel.js";
import jwt from 'jsonwebtoken';



export const userAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id)
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
        
    }
}