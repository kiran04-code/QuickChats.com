import React, { useState,useEffect } from 'react'
import { useNavigate } from "react-router-dom"
import assets, { userDummyData } from '../assets/assets'
import { useAuth } from '../context/AuthContext'
import { useChat } from '../context/chatsContext'
const Sidebar = () => {
  const [input,setInput] = useState()
  const navigate = useNavigate()
  const {Alluseres,selectedUser,setSelectedUser,unseenMessage,setUnseenMessage,getAllUser} = useChat()
 const {Logout,OnlineUser} = useAuth()
  const filterUsers = input ? Alluseres.filter((user)=>user.fullName.toLowerCase().includes(input.toLowerCase()) ) : Alluseres 
  
      useEffect(() => {
          getAllUser();
      }, [OnlineUser]);
  
  return (
    <div className={`bg-[#8185B2]/10 h-117 rounded-2xl p-5 rounded-r-xl overflow-y-scroll text-white ${selectedUser ? "max-md:" : ""}`} >
      <div className='pb-15'>
        <div className='flex justify-between items-center'>
          <img src={assets.logo} alt="Logo" className='max-w-40' />

          <div className='relative group'>
            <img src={assets.menu_icon} alt="Menu" className='max-h-5 cursor-pointer ml-4' />

            {/* Dropdown Menu */}
            <div className='absolute right-0 top-7 z-20 w-32 p-5 rounded-md bg-[#272142] border border-gray-600 text-gray-100 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition duration-200'>
              <p onClick={() => navigate("/Profile")} className='cursor-pointer text-sm hover:text-gray-300'>Edit Profile</p>
              <hr className='my-2 border-t border-gray-500' />
              <p className='cursor-pointer text-sm hover:text-red-400' onClick={Logout}>Logout</p>
            </div>
          </div>
        </div>
        <div className='flex gap-2 p-2 bg-[#282142] rounded-full items-center mt-5 px-4 py-3'>
          <img src={assets.search_icon} alt="" className='w-3' />
          <input    onChange={(e)=>setInput(e.target.value)} value = {input} type="text" placeholder='Search User to start New Chat  ' className='bg-transparent border-none outline-none text-white text-xs placeholder:-[#c8c8c8] flex-1'/>
        </div>

      </div>

     <div className='flex flex-col'>
  {
    filterUsers.map((user, index) => (
      <div 
        key={index}
        className={`relative flex items-center gap-2 p-2 pl-4 rounded-4xl cursor-pointer max-sm:text-sm ${selectedUser?._id === user._id ? 'bg-[#282142]/50' : ''}`}
        onClick={() => setSelectedUser(user)}
      >
        <img src={user?.ProfilePic || assets.arrow_icon} alt="" className='w-[35px] aspect-[1/1] rounded-full' />
        <div className='flex flex-col leading-5'>
          <p>{user.fullName}</p>
   {
  OnlineUser.includes(user._id) ? (
    <span className="text-green-400 text-xs">Online</span>
  ) : (
    <span className="text-neutral-400 text-xs">Offline</span>
  )
}

        </div>
        {
          unseenMessage[user._id]&& 
          <p className='absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50'>{unseenMessage[user._id]}</p>
        }
      </div>
    ))
  }
</div>

    </div>
  )
}

export default Sidebar
