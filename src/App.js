import './App.css';
import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth } from './firebase-config.js'
import Header from './components/Header';
import SignUp from './components/SignUp';
import Homepage from './components/Homepage';
import Login from './components/Login';
import Main from './components/Main';

function App() {
  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<SignUp />} />
        <Route path='/homepage' element={<Homepage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/main' element={<Main />} />
      </Routes>
      </BrowserRouter>
    </>

  );
}

export default App;
