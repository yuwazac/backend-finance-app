
import mongoose from "mongoose";

const trackSchema = new mongoose.Schema({
    username:{type:String , required:true},
    email:{
        type:String, required:true,
        unique:true
    },
    password:{type:String, required:true},
    role:{type:String, enum:["user", "admin"], default:"user"},
    profile:{
        type:String,
        default:"https://res.cloudinary.com/dzj8q4m9c/image/upload/v1700000000/default-profile-picture.png"
    }
}, {timestamps:true})

export default mongoose.model("TrackUser", trackSchema)