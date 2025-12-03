import { useState } from 'react'
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import './App.css'
import Home from './component/Home.jsx'
import Login from './component/auth/login/login.jsx'
import Signup from './component/auth/signup/Signup.jsx'
import ForgotPassword from './component/auth/forgotPassword/forgotPassword.jsx'
import VerifyAccount from './component/auth/verifyAccount/verifyAccount.jsx'
import Documentation from './component/documentation/documentation.jsx'
import Admin from './component/dashboard/admin/admin.jsx'
import Voter from './component/dashboard/voter/voter.jsx'

function App() {
  return(
    <BrowserRouter>
    <Routes>
      <Route path="/voter" element={<Voter />} />

      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} /> 
      
      <Route path="/admin" element={<Admin />} />
      <Route path="/documentation" element={<Documentation />} /> 
      <Route path="/auth/forgot-password" element={<ForgotPassword />}/>
      <Route path="/auth/verify-account" element={<VerifyAccount />}/>
      <Route path="/*" element={<Home />} />
    </Routes>
    </BrowserRouter>
    
  )
}

export default App
