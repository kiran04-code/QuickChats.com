import express from "express"
const app = express()
import { Server } from "socket.io"
import cors from "cors"
import { checkAuth } from "./middleware/user.js"
import cookieParser from "cookie-parser"
import "dotenv/config"
import { conneDB } from "./config/db.js"
import userroutes from "./routes/user.js"
import messageRoutes from "./routes/message.js"

import http from "http"
// create the server using node http beacuse the socet.io is not support to the express
const server = http.createServer(app)

// initilizes the soceket.io server
// ✅ Setup CORS correctly for frontend on port 5173
export const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

export const UserSocketMap = {};

io.on("connection", (socket) => {
  const userid = socket.handshake.query.userid; 
  if (userid) UserSocketMap[userid] = socket.id;

  io.emit("getOnlineUser", Object.keys(UserSocketMap));

  socket.on("Disconnected", () => {
    console.log("❌ User Disconnected:", userid);
    delete UserSocketMap[userid];
    io.emit("getOnlineUser", Object.keys(UserSocketMap));
  });
});

// middlewar

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({
  origin: "*", // or your React app's origin
  credentials: true
}));
app.use(cookieParser())
app.use(checkAuth("access_Token"))

// MONGODB connection 
conneDB(process.env.MONGODB_URL).then(()=>{
console.log("mongoDB is Connected")
}).catch((error)=>{
    console.log("Error With MongoDB",error)
})
// Staring of Server!
app.get("/api/status", (req, res) => {
  res.json({
    message: "Server is Live KiraN.Dev!",
    user: req.user
  });
});
app.get("/api", (req, res) => {
  res.send("API running");
});

// Route SetsUp
app.use("/api/",userroutes)
app.use("/api/",messageRoutes)
if(process.env.NODE_ENV !== "production"){
  const port =  process.env.PORT || 3007
server.listen(port,(req,res)=>{
console.log(`server is Running on Port http://localhost:${port}`)
})
}
// For vercal
export default server