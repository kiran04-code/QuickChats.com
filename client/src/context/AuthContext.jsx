// authContext.js
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios"
import { io } from "socket.io-client"
import toast from "react-hot-toast"
// Create Context
const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl
axios.defaults.withCredentials = true; // ✅ Add this line

export const AuthContext = createContext();

// Context Provider Component
export const AuthContextProvider = ({ children }) => {
  const [authUser, setAuthuser] = useState();

  const [OnlineUser, setOnlineUser] = useState(() => {
    const stored = localStorage.getItem("OnlineUser");
    return stored ? JSON.parse(stored) : [];
  });
  useEffect(() => {
    localStorage.setItem("OnlineUser", JSON.stringify(OnlineUser));
  }, [OnlineUser]);

  const [socket, setsocket] = useState(null);
  const checkconneSocket = async (userData) => {
    try {
      if (!userData || (socket && socket.connected)) return;

      const newSocket = io("http://localhost:5002", {
        query: { userid: userData._id },
      });

      newSocket.on("connect", () => {
        console.log("✅ Socket connected");
        toast.success("Socket connected");
      });

      newSocket.on("getOnlineUser", (userIds) => {
        console.log("🔄 Online users:", userIds);
        setOnlineUser(userIds);
      });

      newSocket.on("disconnect", () => {
        console.log("❌ Socket disconnected");

      });
      setsocket(newSocket);
    } catch (error) {
      console.error("Socket connection error:", error);
      toast.error("Issue to connect socket.io");
    }
  };

  // Login  function to handle UserAuthecation And Socket Connections
  const Login = async (state, credentials) => {
    try {
      const { data } = await axios.post(`/api/${state}`, credentials, { withCredentials: true })
      if (data.sucess) {
        setAuthuser(data.userData)
        checkconneSocket(data.userData)
        toast.success(data.message)

      } else {
        toast.error(data.message)
      }
    } catch (error) {
      if (error.response) {
        // Backend responded with an error status
        if (error.response.status === 400) {
          toast.error("Error 400: Missing details. Please fill all required fields.");
        } else if (error.response.status === 409) {
          toast.error("Error 409: User already exists.");
        } else {
          toast.error(error.response.data.message || "Something went wrong.");
        }
      } else {
        // Network or other errors
        toast.error(error.message || "Something went wrong.");
      }
    }
  }
  // checkuserAuth 
 const handleAuth = async(req,res)=>{
  try {
    const {data} = await axios.get("/api/checkAuths",{withCredentials:true})
    if(data.sucess){
      setAuthuser(data.userData)
    }
  } catch (error) {
    console.log(error)
  }
 }
  // updated the User Profile
  const updatUserProfile = async (body) => {
    try {
      const { data } = await axios.put("/api/Update-Profile", body, { withCredentials: true })
      if (data.success) {
        setAuthuser(data.user)
        toast.success("Profile Update Sucessfully")
      }
      else {
        toast.error("issue to Update the Profile ")
      }
    } catch (error) {
      toast.error(error.message)
    }
  }
  // logout function for logout there profile and disconnete the socket.io
  const Logout = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("authUser"));
      const userId = storedUser?._id;

      const { data } = await axios.get("/api/Logout", { withCredentials: true });

      if (data.success) {
        if (userId) {
          const online = JSON.parse(localStorage.getItem("OnlineUser")) || [];
          const updatedOnline = online.filter(id => id !== userId);
          localStorage.setItem("OnlineUser", JSON.stringify(updatedOnline));
          setOnlineUser(updatedOnline);
        }

        setAuthuser(null);
        if (socket) socket.disconnect();
        toast.success(data.message || "Logged out successfully");
      } else {
        toast.error(data.message || "Logout failed");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const value = {
    axios,
    authUser,
    setAuthuser,
    OnlineUser,
    setOnlineUser,
    socket,
    setsocket,
    Login,
    Logout,
    updatUserProfile

  }
useEffect(()=>{
  handleAuth()
},[])
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook to use AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
