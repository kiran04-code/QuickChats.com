import React, { useEffect, useRef, useState } from 'react'
import assets from '../assets/assets'
import { formatTime } from '../lib/utils'
import { useChat } from '../context/chatsContext'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import message from '../../../server/model/Message'

const ChatContainer = () => {
  const { getSelectedMessage, sendMessage, message, selectedUser, setSelectedUser } = useChat()
  const { authUser, OnlineUser } = useAuth()
  const scrollEND = useRef(null)
  const [input, setInput] = useState('')
  const handlesendMessage = async (e) => {
    e.preventDefault()
    if (input.trim() === "") return
    await sendMessage({ text: input.trim() })
    setInput("")
  }

  const handleSendingImage = async (e) => {
    const file = e.target.files[0]
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Select an image file")
      return
    }

    const reader = new FileReader()
    reader.onloadend = async () => {
      await sendMessage({ image: reader.result })
      e.target.value = ""
    }
    reader.readAsDataURL(file)
  }

  useEffect(() => {
    if (!scrollEND.current) return
    const timeout = setTimeout(() => {
      scrollEND.current.scrollIntoView({ behavior: 'smooth' })
    }, 100)
    return () => clearTimeout(timeout)
  }, [message])

  useEffect(() => {
    if (selectedUser) {
      getSelectedMessage(selectedUser._id)
    }
  }, [selectedUser])

  return selectedUser ? (
    <div className="h-[480px] flex flex-col relative backdrop-blur-lg overflow-scroll w-full">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-stone-500 p-2">
        <img src={selectedUser?.ProfilePic || assets.profile_martin} alt="" className="w-8 rounded-full mb-2" />
        <p className="flex-1 text-lg text-white">{selectedUser?.fullName}</p>
        {
          OnlineUser.includes(selectedUser._id) ? (

            <div className='flex gap-2'>
              <div className="w-2 h-2 bg-green-500 rounded-full mt-1"></div>
              <span className="text-green-400 text-xs flex gap-2">Online</span>
            </div>
          ) : (
            <div className='flex gap-2'>
              <div className="w-2 h-2 bg-red-500 rounded-full mt-1"></div>
              <span className="text-neutral-400 text-xs">Offline </span>
            </div>
          )
        }
        <img onClick={() => setSelectedUser(null)} src={assets.arrow_icon} alt="" className="md:hidden w-7" />
        <img src={assets.vicons} alt="" className="max-md:hidden w-5" />
        <img src={assets.help_icon} alt="" className="max-md:hidden w-5" />
      </div>

      {/* Messages */}
      <div className="flex-1 h-0 overflow-y-auto p-3 space-y-4">
        
        {message.map((msg, index) => (
            <div
              key={index}
              className={`flex items-end gap-2 ${msg.senderId === authUser._id ? 'justify-end' : 'justify-start'}`}
            >
              {msg.image ? (
                <img
                  src={msg.image}
                  className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8"
                  alt="message"
                />
              ) : (
                <p
                  className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-violet-600  text-white ${msg.senderId === authUser._id
                      ? ' rounded-br-none'
                      : ' rounded-bl-none'
                    }`}
                >
                  {msg.text}
                </p>
              )}

              <div className="text-center text-xs">
                <img
                  src={
                    msg.senderId === authUser._id
                      ? authUser?.ProfilePic || assets.avatar_icon
                      : selectedUser?.ProfilePic || assets.profile_martin
                  }
                  className="rounded-full w-7"
                  alt="avatar"
                />
                <p className="text-gray-500">{formatTime(msg.createdAt)}</p>
              </div>
            </div>
          ))}
        <div ref={scrollEND}></div>
      </div>

      {/* Input */}
      <div className="flex items-center gap-3 p-3 border-t border-gray-700 bg-black/30 ">
        <div className="flex flex-1 items-center bg-gray-100/10 px-3 rounded-full">
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            onKeyDown={(e) => (e.key === 'Enter' ? handlesendMessage(e) : null)}
            type="text"
            placeholder="Send a message"
            className="flex-1 text-sm p-3 border-none rounded-lg outline-none text-white bg-transparent placeholder-gray-400"
          />
          <input onChange={handleSendingImage} type="file" id="image" accept="image/png, image/jpeg" hidden />
          <label htmlFor="image">
            <img src={assets.gallery_icon} alt="" className="w-5 mr-2 cursor-pointer" />
          </label>
        </div>
        <button
          onClick={handlesendMessage}
          className="bg-violet-600 text-white px-4 py-2 rounded-full text-sm hover:bg-violet-700 transition duration-200"
        >
          Send
        </button>
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 rounded-2xl max-md:hidden h-full">
      <img src={assets.logo_icon} alt="" className="max-w-16" />
      <p className="text-lg font-medium text-white">Chat anyTime, anyWhere</p>
    </div>
  )
}

export default ChatContainer
