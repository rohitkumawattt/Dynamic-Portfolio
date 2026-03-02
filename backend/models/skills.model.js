import mongoose from 'mongoose';
import user from './user.model.js';

const skillSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    name:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true,
        enum:['Frontend','Backend','Tools','Soft Skills','Programming Language'],
    },
    proficiency:{
        type:String,
        required:true
    }
},{timestamps:true})

const skill = mongoose.model('skill',skillSchema);
export default skill;