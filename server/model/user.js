import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
    fullName:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true,
        minlength:6
    },
    ProfilePic:{
        type:String,
        default:""
    },
    bio:{
        type:String,
    }
},{timestamps:true})

const User = mongoose.model("user",UserSchema)

export default User