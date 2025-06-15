import mongoose  from "mongoose"

const MessageSchema = new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        require:true
    },
    receiverid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        require:true
    },
    text:{
        type:String
    },
    image:{
        type:String
    },
    seen:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

const message = mongoose.model("message",MessageSchema)

export default message