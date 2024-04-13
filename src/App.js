import React from 'react'
import { Route, Routes } from "react-router-dom";

import UserHomePage from "./pages/Home/UserHomePage";
import Profile from "./pages/Profile/Profile";
import Explore from "./pages/Explore/Explore";
import Savedpost from './pages/Saved/Savedpost';
import AdminPage from "./pages/AdminPage";
import Chat from "./pages/Chat/Chat"
import ZegoVcall from './components/Chat/ChatBox/ZegoVideocall';
import UserLogin from "./components/User/UserLogin";
import UserSignup from "./components/User/UserSignup";
import VerifyOtp from './components/User/VerifyOtp';
import ForgotPwEmail from './components/User/ForgotPwEmail';
import ForgotPwOtp from './components/User/ForgotPwOtp';
import FriendProfile from './components/User/Friend/FriendProfile';
import AdminLogin from './components/Admin/AdminLogin'
import UserManage from './components/Admin/UserManage'
import Notifications from './components/Admin/Notifications';
import ResetPassword from './components/User/ResetPassword';



function App() {
  return (
    <>    
       <Routes>
            <Route element={<UserLogin />} path="/" />
            <Route element={< UserSignup />} path="/signup" />
            <Route element={<VerifyOtp />} path="/otp" />
            <Route element={<ForgotPwEmail/>} path="/forgotpwemail" />
            <Route element={<ForgotPwOtp />} path="/otp_forgotpw" />
            <Route element={<ResetPassword />} path="/resetpassword" />
            <Route element={<UserHomePage />} path="/feedhome" />
            <Route element={<Profile />} path="/username" />
            <Route element={<FriendProfile/>} path="/username/:userid" />
            <Route element={<Explore />} path="/Explore" />
            <Route element={<Savedpost />} path="/savedpost" /> 
     

            <Route element={<AdminLogin />} path="/admin" />
            <Route element={<AdminPage />} path="/dashboard" /> 
            <Route element={<UserManage />} path="/users" /> 
            <Route element={<Notifications/>} path="/notifications" />

              
            <Route element={<Chat />} path="/chat" /> 
            <Route element={<ZegoVcall/>} path="/meeting/:userId/:id" />
       </Routes>
      
    </>
  )
}

export default App
