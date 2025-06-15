import React, { useState } from 'react'
import assets from '../assets/assets'
import { useAuth } from '../context/AuthContext';
import Google from '../components/google';
const Login = () => {
  const [current, setCurrent] = useState("Sign up");
  const [email,setemail]  = useState("")
  const [password,setpassword]  = useState("")
  const [bio,setbio]  = useState("")
  const [fullName,setfullName]  = useState("")
  
  const [isDataSubmit, setIsDataSubmit] = useState(false);
 
 const {Login} = useAuth()

  const HandlerSubmit = async(e) =>{
  e.preventDefault()
  if(current === "Sign up" && !isDataSubmit){
   setIsDataSubmit(true)
  }
  Login(current === "Sign up" ? "signup":"signin",{fullName,email,bio,password})
  }
  return (

    <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>
      
      {/* Left Side - Logo */}
     <div>
       <img src={assets.logo_big} alt="Logo" className='w-[min(30vw,350px)]' />
   <div className='flex items-center justify-center gap-1'>
        <p className="text-sm text-gray-500 text-center mt-4">
  Powered by <strong>Kiran.Dev</strong>
  
</p>
<img src={assets.code} alt="" className='w-4 mt-4' />
   </div>
     </div>
  
      
      {/* Right Side - Form */}
      <form
        onSubmit={HandlerSubmit}
        className='border-2 bg-white/5 text-white border-gray-500 flex flex-col justify-between px-6 py-15 rounded-xl'
      >
        {/* Title */}
        <h1 className=' font-medium text-2xl flex items-center justify-between gap-2'>
          {current}
          {
            isDataSubmit && <img src={assets.arrow_icon} alt="Arrow" className='w-5'onClick={()=>setIsDataSubmit(false)} />
          }
        </h1>

        {/* Name Field - only on Signup and before submitting */}
        {current === "Sign up" && !isDataSubmit && (
          <input
            type="text"
            name="fullName"
            onChange={(e)=>setfullName(e.target.value)}  value = {fullName}
            placeholder="Full Name"
            className="p-2 mt-4 border border-gray-500 rounded-md focus:outline-none"
            required
          />
        )}

        {/* Email and Password Fields - always before submission */}
        {!isDataSubmit &&  (
          <>
            <input
              type="email"
              name='email'
              onChange={(e)=>setemail(e.target.value)}  value = {email}
              autoComplete="off"
              placeholder="Email Address"
              className="p-2 mt-3 border border-gray-500 rounded-md focus:outline-none focus:ring-indigo-500"
              required
            />
            <input
              type="password"
              autoComplete="off"
              name="password"
              onChange={(e)=>setpassword(e.target.value)}  value = {password}
              placeholder="Password"
              className="p-2 mt-3 border border-gray-500 rounded-md focus:outline-none focus:ring-indigo-500"
              required
            />
          </>
        )}

        {/* Bio Field - only after data is submitted */}
        {current === "Sign up" &&  isDataSubmit &&  (
          <textarea
            rows={4}
            name='bio'
            onChange={(e)=>setbio(e.target.value)}  value = {bio}
            placeholder="Provide a Short Bio"
            className="p-2 mt-3 border border-gray-500 rounded-md focus:outline-none focus:ring-indigo-500"
            required
          />
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-4 bg-gradient-to-r from-purple-400 to-violet-600 text-white text-sm font-light py-2 w-[320px] rounded-sm"
        >
          {current === "Sign up" ? "Create Account" : "Login Now"}
        </button>
        <Google/>
        {/* Terms and Conditions */}
        <div className='flex items-start gap-2 mt-5'>
          <input type="checkbox" required />
          <p className='text-sm text-gray-600 '>Agree to the terms of use & Privacy Policy</p>
        </div>
        <div className='flex flex-col gap-2'>
         {
          current === "Sign up" ? (<p className='text-sm text-gray-600 ' >
            Already Have an Account <span  className='font-medium text-violet-500 cursor-pointer' onClick={()=>{setCurrent("Sign In");setIsDataSubmit(false)}}> Login Here
            </span>
          </p>):(<p className='text-sm text-gray-600 '>Create an Account <span className='font-medium text-violet-500 cursor-pointer' onClick={()=>setCurrent("Sign up")}>Click here</span></p>)
         }
        </div>
      </form>
    </div>
  )
}

export default Login
