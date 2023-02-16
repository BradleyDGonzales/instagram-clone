import './App.css';
import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth } from './firebase-config.js'
import Header from './components/Header';
import SignUp from './components/SignUp';
import Homepage from './components/Homepage';
import Login from './components/Login';

function App() {
  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<SignUp />} />
        <Route path='/homepage' element={<Homepage />} />
        <Route path='/login' element={<Login />} />
      </Routes>
      </BrowserRouter>
    </>

  );
}

export default App;
