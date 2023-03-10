import './App.css';
import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { auth } from './firebase-config.js'
import Header from './components/Header';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Main from './components/Main';
import Profile from './components/Profile';
import Upload from './components/Upload';
import UserProfile from './components/UserProfile';
// import EditProfile from './components/EditProfile';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<SignUp />} />
          <Route path='/login' element={<Login />} />
          <Route path='/main' element={<Main />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/upload' element={<Upload /> } />
          <Route path='/userprofile' element={<UserProfile />} /> 
          {/* <Route path='/edit_profile' element={<EditProfile />} /> */}
        </Routes>
      </BrowserRouter>
    </>

  );
}

export default App;
