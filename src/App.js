import './App.css';
import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { auth } from './firebase-config.js'
import Header from './components/Header';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Main from './components/Main';
import Profile from './components/Profile';

function App() {
  useEffect(() => {
    console.log('asdfdsf')
  })
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<SignUp />} />
          <Route path='/login' element={<Login />} />
          <Route path='/main' element={<Main />} />
          <Route path='/profile' element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </>

  );
}

export default App;
