import { blacklistModel } from "../models/blacklistModel.js";
import { captainModel } from "../models/captainModel.js";
import jwt from 'jsonwebtoken';



export const captainAuth = async (req, res, next) => {
    try {
        const cap_token = req.cookies.cap_token || req.headers.authorization.split(' ')[1];
        if (!cap_token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const isBlacklisted = await blacklistModel.findOne({ cap_token });

        if (isBlacklisted) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const decoded = jwt.verify(cap_token, process.env.JWT_SECRET);
         
        const captain = await captainModel.findById(decoded.id)

  
        if (!captain) {
            return res.status(404).json({ message: "captain not found" });
        }
        req.captain = captain;
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });

    }
}