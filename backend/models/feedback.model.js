import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    },
    rating:{
        type:Number,
        required:true
    },
    status:{
        type:Boolean,
        default:false
    },
},{
    timestamps:true
})


const feedback = mongoose.model("Feedback", feedbackSchema);
export default feedback;