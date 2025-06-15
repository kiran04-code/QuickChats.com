import cloudinary from "../config/claoudinary.js"
import message from "../model/Message.js"
import User from "../model/user.js"
import {io,UserSocketMap} from "../server.js"

// get all user Aceeps the LoginUser `
export const getUserForSidebar = async(req,res) =>{
  try {
    const userid = req.user._id
    const FilterUser = await User.find({_id:{$ne:userid}})
    // count number of unseen Message
   const UnseenMessage = {}

const promises = FilterUser.map(async (user) => {
  const messages = await message.find({
    senderId: user._id,
    receiverid: userid,
    seen: false
  })

  if (messages.length > 0) {
    UnseenMessage[user._id] = messages.length
  }
})

await Promise.all(promises)

    res.json({
      sucess:true,
      useres:FilterUser,
      UnseenMessage
    })
  } catch (error) {
    console.log(error)
    res.json({
      sucess:false,
     message:error.message
    })
  }
}

// gets All Message for all Users

export const getMessages = async (req, res) => {
  try {
    const { id: selectedId } = req.params;
    const myID = req.user._id;

    const data = await message.find({
      $or: [
        { senderId: myID, receiverid: selectedId },
        { senderId: selectedId, receiverid: myID },
      ],
    });

    // Mark received messages as seen
    await message.updateMany(
      { senderId: selectedId, receiverid: myID },
      { seen: true }
    );

    res.json({
      success: true,
      datas: data,
      message: "Messages fetched successfully",
    });

  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// api to mark message as seen Using message

export const markMessageSeen = async (req,res) =>{
  try {
    const {id} = req.params
    await message.findOneAndUpdate(id,{seen:true})
    res.json({
      sucess:true,})
  } catch (error) {
    console.log(error)
    res.json({
      sucess:false,
     message:error.message
    })
  }
  }

  // send message to seletected User 

export const sendMessageToUser = async (req, res) => {
  try {
    const { text, image } = req.body;
    const recieverIds = req.params.id;
    const senderIds = req.user._id;
    let imageUrl;

    if (image) {
      const upload = await cloudinary.uploader.upload(image);
      imageUrl = upload.secure_url;
    }

    const newchats = await message.create({
      text,
      image: imageUrl,
      senderId: senderIds,
      receiverid: recieverIds,
    });

    // ✅ Emit the new message to the receiver socket
    const receiverSocketID = UserSocketMap[recieverIds];
    if (receiverSocketID) {
      io.to(receiverSocketID).emit("newMessage", newchats);
    }

    res.json({
      success: true,
      newchats,
      message: "Send Successful",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};
