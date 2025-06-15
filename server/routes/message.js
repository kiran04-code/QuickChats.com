import express from"express"
import {getUserForSidebar,markMessageSeen ,getMessages,sendMessageToUser } from "../controller/messageController.js"
const messageRoutes = express.Router()

messageRoutes.get("/getUserForSidebar",getUserForSidebar)
messageRoutes.get("/get-Message/:id",getMessages)
messageRoutes.put("/markMessageSeen/:id ",markMessageSeen )
messageRoutes.post("/send-message-to-user/:id", sendMessageToUser);


export default messageRoutes