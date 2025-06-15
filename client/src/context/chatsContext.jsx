import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

// 1. Create context
export const ChatContext = createContext();

// 2. Context Provider
export const ChatContextProvider = ({ children }) => {
    const [message, setMessage] = useState([]); // corrected typo from setmeesage
    const [Alluseres, setAllusers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null); // corrected typo
    const [unseenMessage, setUnseenMessage] = useState({});
    const { axios, socket } = useAuth();
    // Get all users except the logged-in one
    const getAllUser = async () => {
        try {
            const { data } = await axios.get("/api/getUserForSidebar", { withCredentials: true });
            if (data.sucess) {
                setAllusers(data.useres);
                setUnseenMessage(data.UnseenMessage)

            }
        } catch (error) {
            toast.error(error.message);
        }
    };
 // get all seleted mess for each user
 const getSelectedMessage = async (userid) => {
  try {
    const { data } = await axios.get(`/api/get-Message/${userid}`, {
      withCredentials: true,
    });

    if (data.success) {
      setMessage(data.datas);
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.message);
  }
};


 // send the messeage to selected User!
 const sendMessage = async (messageData) => {
  try {
    const { data } = await axios.post(
      `/api/send-message-to-user/${selectedUser._id}`,
      messageData,
      { withCredentials: true }
    );

    if (data.success) {
      setMessage((prev = []) => [...prev, data.newchats]);
      toast.success(data.message);
    } else {
      toast.error(data.message || "Failed to send message.");
    }
  } catch (error) {
    toast.error(error.message);
  }
};

const subscripmessage = async () => {
  if (!socket) return;

  socket.on("newMessage", async (newchats) => {
    if (selectedUser && newchats.senderId === selectedUser._id) {
      newchats.seen = true;

      setMessage((prev) => [...prev, newchats]);

      await axios.put(`/api/markMessageSeen/${selectedUser._id}`);
    } else {
      setUnseenMessage((prev) => ({
        ...prev,
        [newchats.senderId]: prev[newchats.senderId] ? prev[newchats.senderId] + 1 : 1,
      }));
    }
  });
};

// functioin to unsubscripbe 

const unscripofommessage = () => {
  if (socket) socket.off("newMessage");
};

useEffect(() => {
  subscripmessage();

  return () => {
    unscripofommessage();
  };
}, [socket, selectedUser]);

    const value = {
        Alluseres,
        selectedUser,
        unseenMessage,
        setSelectedUser,
        message,
        setMessage,
        // function //
        getSelectedMessage,
        sendMessage,
        getAllUser
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
};

// 3. Custom Hook to use ChatContext
export const useChat = () => {
    return useContext(ChatContext); // RETURN is important
};
