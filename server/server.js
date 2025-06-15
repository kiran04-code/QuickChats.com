import express from "express";
const app = express();
import { Server } from "socket.io";
import cors from "cors";
import { checkAuth } from "./middleware/user.js";
import cookieParser from "cookie-parser";
import "dotenv/config";
import { conneDB } from "./config/db.js";
import userroutes from "./routes/user.js";
import messageRoutes from "./routes/message.js";
import http from "http";

const server = http.createServer(app);

// ✅ Allowed Origins (No trailing slashes)
const allowedOrigins = [
  "https://chatapp-iota-pink.vercel.app",
  "http://localhost:5173"
];

// ✅ Global CORS Middleware for Express
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

// ✅ Handle preflight OPTIONS requests globally
app.options("*", cors(corsOptions));

// ✅ CORS for Socket.io
export const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

// 👥 User Socket Map
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

// 🔧 Middleware Setup
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(checkAuth("access_Token"));

// 🌐 MongoDB Connection
conneDB(process.env.MONGODB_URL).then(() => {
  console.log("✅ MongoDB is Connected");
}).catch((error) => {
  console.log("❌ MongoDB Connection Error", error);
});

// 🛠️ Routes and Status
app.get("/api/status", (req, res) => {
  res.json({
    message: "Server is Live KiraN.Dev!",
    user: req.user
  });
});

app.get("/api", (req, res) => {
  res.send("API running");
});

app.use("/api/", userroutes);
app.use("/api/", messageRoutes);

// 🌍 Start Server (Only locally)
if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 3007;
  server.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
  });
}

// ✅ For Vercel Export
export default server;
