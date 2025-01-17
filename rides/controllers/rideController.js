import {  rideModel } from "../models/rideModel.js";
import { publishToQueue } from "../service/rabbit.js";



export const createRide = async (req,res)=>{
    try {
        const {pickup, destination} = req.body;

        const newRide = new rideModel({
            user: req.user._id,
            pickup,
            destination
        })
         
        await newRide.save();
publishToQueue("new-ride",JSON.stringify(newRide));
res.status(201).send(newRide);
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:error.message});
    }
}




export const acceptRide = async (req,res)=>{
    try {
        const {rideId} = req.query;
        const ride = await rideModel.findById(rideId);
        if(!ride){
            return res.status(404).json({message:"Ride not found"});
        }
        ride.status = "accepted";
        await ride.save();
        publishToQueue("ride-accepted",JSON.stringify(ride));
        res.status(200).send(ride);
        
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}