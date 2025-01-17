import { userModel } from "../models/userModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { blacklistModel } from "../models/blacklistModel.js";
import { subscribeToQueue } from "../service/rabbit.js";
import { EventEmitter } from 'events';

const rideEvent = new EventEmitter();

export const register = async (req,res)=>{
    try{
        const {name,email,password} = req.body;
        const user = await  userModel.findOne({email});
        if(user){
            return res.status(400).send("User already exists");
        }
        const hash = await bcrypt.hash(password,10);
        const newUser = new userModel({
            name,
            email,
            password: hash
        });
        await newUser.save();

        const token = jwt.sign({id:newUser._id},process.env.JWT_SECRET,{
            expiresIn: "1h"
        });
        res.cookie("token",token);

        res.status(201).send({token,newUser});
    }catch(error){
        console.log(error); 

    }
}

export const  login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel
            .findOne({ email })
            .select('+password');

        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }


        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        delete user._doc.password;

        res.cookie('token', token);

        res.send({ token, user });

    } catch (error) {

        res.status(500).json({ message: error.message });
    }

}


export const logout = async (req, res) => {
    try {
        const token = req.cookies.token;
        await blacklistModel.create({ token });
        res.clearCookie('token');
        res.send({ message: 'User logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const profile = async (req, res) => {
    try {
        res.send(req.user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}




export const acceptedRide= async (req,res)=>{
  try {
    
  rideEvent.once("ride-accepted",async(data)=>{
     
       res.send(data);
    
    })

    setTimeout(()=>{
        res.sendStatus(204)
    },30000);


  } catch (error) {
    return res.status(500).json({message:error.message});
  }

}

subscribeToQueue("ride-accepted", async(msg)=>{
    const data = JSON.parse(msg);
    rideEvent.emit("ride-accepted",data);
    
});