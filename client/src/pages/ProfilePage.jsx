import React, { useState } from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProfilePage = () => {
  const {authUser,updatUserProfile} = useAuth()
  console.log()
  const navigate = useNavigate()
  const [selectedImage,setselectedImage] = useState(null)
  const [name,setName] = useState(authUser.fullName)
  const [bio,setbio] = useState(authUser.bio)
  
  const hnadleSubmit = async(e) =>{
  e.preventDefault()
  if(!selectedImage){
    await updatUserProfile({fullName:name,bio})
    navigate("/");
    return;
  }
  const render = new FileReader();
render.readAsDataURL(selectedImage);

render.onload = async () => {
  const base64Image = render.result;

  try {
    await updatUserProfile({
      ProfilePic: base64Image,   // ✅ Match backend's expected key
      fullName: name,
      bio: bio
    });

    navigate("/");
  } catch (error) {
    console.error("Profile update failed:", error);
  }
};
  }
  return (
    <div className='min-h-screen  bg-cover bg-no-repeat flex items-center justify-center'>
      <div className='w-5/6 max-w-2xl backdrop-blur-2xl text-gray-500  border-2 border-gray-600 items-center justify-center flex rounded-lg'>
        {/* {  user Data} */}
        <form className='flex flex-col gap-5 p-10 flex-1' onSubmit={hnadleSubmit}>
          <h3 className='text-lg text-white'>Profile Details</h3>
          <label htmlFor="avtar" className='flex  items-center gap-3 cursor-pointer text-white'>
         <input type="file" id="avtar" accept='.png , .jpeg ,.jpg' hidden onChange={(e)=>setselectedImage(e.target.files[0])}/>
         <img src = {selectedImage ? URL.createObjectURL(selectedImage):assets.avatar_icon} alt="" className={`w-12 h-12 ${ selectedImage && "rounded-full"}`} />
         UpLoad Profile Image
         </label>
         <input type="text" placeholder='Your name' onChange={(e)=>setName(e.target.value)} value= {name}  required className='  text-white  p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500'/>
         <textarea type="text" placeholder='' onChange={(e)=>setbio(e.target.value)} value= {bio}  required className=' text-white  p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500'/>
          <button  type = "submit "className='bg-gradient-to-r from-purple-400 to-violet-600 text-white text-lg font-light rounded-xl p-2 '>Save</button>
        </form>
        <div>
          <img src={ authUser?.ProfilePic||assets.logo_icon} alt="" className={`max-w-44 aspect-square rounded-full mx-10 ${ selectedImage && 'rounded-full'} }`}/>
          <h1 className='text-white mt-2 ml-10 text-center w-50 '> Hi,{authUser?.fullName} welcome to Quick Chat.com</h1>
        </div>
      </div>
      
    </div>
  )
}

export default ProfilePage
