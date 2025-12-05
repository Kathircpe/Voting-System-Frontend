import { useEffect, useState } from 'react'
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import './App.css'
import Home from './component/home/Home.jsx'
import Login from './component/auth/login/login.jsx'
import Signup from './component/auth/signup/Signup.jsx'
import ForgotPassword from './component/auth/forgotPassword/forgotPassword.jsx'
import VerifyAccount from './component/auth/verifyAccount/verifyAccount.jsx'
import Documentation from './component/documentation/documentation.jsx'
import Admin from './component/dashboard/admin/admin.jsx'
import Voter from './component/dashboard/voter/voter.jsx'

function App() {
  useEffect(() => {
    fetch('https://voting-system-aztp.onrender.com')
    .then(()=> console.log("backend is awake"))
    .catch(err => console.log(err));
  },[]);
  return(
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} /> 
      <Route path="/auth/forgot-password" element={<ForgotPassword />}/>
      <Route path="/auth/verify-account" element={<VerifyAccount />}/>
      <Route path="/voter" element={<Voter />} />
      <Route path="/admin" element={<Admin />} />

      <Route path="/documentation" element={<Documentation />} /> 
      
      <Route path="/*" element={<Home />} />

    </Routes>
    </BrowserRouter>
    
  )
}

export default App
