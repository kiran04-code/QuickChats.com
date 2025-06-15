import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import ChatContainer from '../components/chatContainer';
import RightSdebar from '../components/RightSdebar';
import { useChat } from '../context/chatsContext';

const HomePages = () => {
   const {getSelectedMessage,sendMessage,message,selectedUser,setSelectedUser}  = useChat()
  return (
    <div className='h-screen w-full sm:px-[15px] sm:py-[5%] flex justify-center items-center'>
      <div className={`backdrop-blur-3xl border-2 border-gray-600 rounded-2xl overflow-hidden h-[100%] w-[85%] grid gap-4 p-4 ${
        selectedUser
          ? 'grid-cols-1 sm:grid-cols-3 md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]'
          : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-[1fr_2fr]'
      }`}>

        {/* Sidebar */}
        <div>
          <Sidebar  />
        </div>

        {/* ChatContainer - Always visible */}
        <div>
          <ChatContainer />
        </div>

        {/* RightSidebar - Only show when user selected */}
        {selectedUser && (
          <div>
            <RightSdebar/>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePages;
