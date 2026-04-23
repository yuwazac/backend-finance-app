
import mongoose from "mongoose";

const trackSchema = new mongoose.Schema({
    title:{type:String, required:true},
    description:{type:String, required:true},
    date:{type:Date, default:Date.now},
    amount:{type:Number, required:true},
    type:{type:String, enum:["income", "expense"], required:true}
})

export default mongoose.model("Track", trackSchema)