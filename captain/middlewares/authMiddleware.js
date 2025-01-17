import { blacklistModel } from "../models/blacklistModel.js";
import { captainModel } from "../models/captainModel.js";
import jwt from 'jsonwebtoken';



export const captainAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const isBlacklisted = await blacklistModel.findOne({ token });

        if (isBlacklisted) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const captain = await captainModel.findById(decoded.id)

        delete captain._doc.password;
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