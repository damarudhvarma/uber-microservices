import mongoose from "mongoose";


const captainSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        unique: true,
        required: true
    },  
    password:{
        type: String,
        required: true
    },
    isAvailable:{
        type: Boolean,
        default: false
    }

})

export const captainModel = mongoose.model('Captain',captainSchema);