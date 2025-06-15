import React,{useState,useEffect} from 'react'
import assets, { imagesDummyData } from '../assets/assets'
import { useAuth } from '../context/AuthContext'
import { useChat } from '../context/chatsContext'
const RightSdebar = () => {
   const {selectedUser,setSelectedUser,message} = useChat()
   const {Logout} = useAuth()
    const [mesgImage,setImage] = useState([])
     useEffect(()=>{
       setImage(message.filter(msg=>msg.image).map( msg=>msg.image))
        
     },[message])
  return  selectedUser && (
    <div className={`bg-[#8185B2]/10 text-white w-full relative overflow-scroll h-117 rounded-2xl`}>
     <div className=' pt-16 flex flex-col items-center gap2 text-xs font-light mx-auto'>
      <img src= {selectedUser?.ProfilePic } alt="" className='w-20 aspect-[1/1] rounded-full '/>
      <h1 className='text-white px-10  text-xl font-medium mx-auto flex items-center gap-2'> 
        <p className='w-2 h-2 rounded-full bg-green-500'></p>
        {selectedUser?.fullName}
        </h1>
        <p>{selectedUser?.bio}</p>
     </div>
         <button   onClick={Logout}  className='ml-7 mt-5 bg-gradient-to-r from-purple-400 to-violet-600 text-white border-none text-sm font-light py-2 px-20 rounded-full cursor-pointer'>
      Logout
     </button>
     <hr className=' border-[#ffffff50] my-4 w-[91%] ml-3' />

     <div className='px-5 text-xs'>
      <p>Media</p>
      <div className='mt-2 max-h-[200px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-80'>
  {
  mesgImage.map((imges, index) => (
    <div key={index} onClick={() => window.open(imges)} className="cursor-pointer ">
      <img src={imges} alt="" className=' rounded-xl ' />
    </div>
  ))
}

      </div>
     </div>
 
    </div>
  )
}

export default RightSdebar
