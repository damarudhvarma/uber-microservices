import { captainModel } from "../models/captainModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { blacklistModel } from "../models/blacklistModel.js";
import { connect, subscribeToQueue } from "../service/rabbit.js";


const pendingRequests = [];

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const captain = await captainModel.findOne({ email });
        if (captain) {
            return res.status(400).send("captain already exists");
        }
        const hash = await bcrypt.hash(password, 10);
        const newcaptain = new captainModel({
            name,
            email,
            password: hash
        });
        await newcaptain.save();

        const token = jwt.sign({ id: newcaptain._id }, process.env.JWT_SECRET, {
            expiresIn: "1h"
        });
        res.cookie("cap_token", token);

        res.status(201).send({ token, newcaptain });
    } catch (error) {
        console.log(error);

    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const captain = await captainModel
            .findOne({ email })
            .select('+password');

        if (!captain) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, captain.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }


        const token = jwt.sign({ id: captain._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        delete captain._doc.password;

        res.cookie('cap_token', token);

        res.send({ token, captain });

    } catch (error) {

        res.status(500).json({ message: error.message });
    }

}


export const logout = async (req, res) => {
    try {
        const token = req.cookies.token;
        await blacklistModel.create({ token });
        res.clearCookie('cap_token');
        res.send({ message: 'captain logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const profile = async (req, res) => {
    try {
        res.send(req.captain);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


export const toggleAvailability = async (req, res) => {
    try{
        const captain =  await captainModel.findById(req.captain._id);
        captain.isAvailable = !captain.isAvailable;
        await captain.save();
        res.send(captain);
    }catch(error){
        res.status(500).json({message:error.message});
    }
}

export const waitForNewRide = async (req, res) => {

   req.setTimeout(30000,()=>{
         res.status(204).end();
   });

   pendingRequests.push(res);


}

subscribeToQueue("new-ride", (data) => {
    const rideData = JSON.parse(data);
    pendingRequests.forEach((res) => {
        res.json({data:rideData});
    });
    pendingRequests.length = 0;


});

