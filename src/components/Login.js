import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth'
import { useEffect, useState } from 'react'
import { auth } from '../firebase-config.js'
const Login = () => {
    const [loginEmail, setLoginEmail] = useState("")
    const [loginPassword, setLoginPassword] = useState("")
    const [user, setUser] = useState({})
    useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);

        })
        console.log(auth);
    })
    const login = async (e) => {
        try {
            const user = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);

        } catch (error) {
            console.log(error)
        }

    }
    
    const logout = async (e) => {
        await signOut(auth)
    }

    return (
        <>
            <div>
                <h3>Login</h3>
                <input placeholder='Email' onChange={(event) => { setLoginEmail(event.target.value) }} />
                <input placeholder='Password' onChange={(event) => { setLoginPassword(event.target.value) }} />
                <button onClick={login}>Login</button>
            </div>
            <div id='loginInfo'>
                <h4>User Logged In: {user?.email}</h4>
                <button onClick={logout}>Sign Out</button>
            </div>
        </>)
}
export default Login;