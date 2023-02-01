import './App.css';
import { useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth } from './firebase-config.js'
import Header from './components/Header';
import SignUp from './components/SignUp';

function App() {
  return (
    <>
      <div className="container">
        <Header />
        <SignUp />

      </div>

    </>
  );
}

export default App;
