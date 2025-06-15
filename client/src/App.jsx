import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePages from './pages/HomePages';
import ProfilePage from './pages/ProfilePage';
import Login from './pages/Login';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';
function App() {
  const {authUser}  = useAuth()
  return (
 <div className="bg-[url('/bgImage.svg')]  bg-center bg-no-repeat bg-cover" >
<Toaster
  position="top-right"
  reverseOrder={false}
  toastOptions={{
    style: {
      background: "#8A2BE2", // Blue Violet
      color: "#fff",         // White text
      fontWeight: "bold",
      borderRadius: "8px",
    },
    success: {
      iconTheme: {
        primary: "#ffffff",
        secondary: "#8A2BE2",
      },
    },
    error: {
      iconTheme: {
        primary: "#ffffff",
        secondary: "#8A2BE2",
      },
    },
  }}
/>
  <BrowserRouter>
      <Routes>
        <Route path='/' element={authUser ?<HomePages />:<Navigate to="/Login"/>} />
        <Route path='/profile' element={authUser ?<ProfilePage />:<Navigate to="/Login"/>} />
        <Route path='/login' element={!authUser ?<Login />:<Navigate to="/"/>} />
      </Routes>
    </BrowserRouter>
  </div>
  );
}

export default App;
