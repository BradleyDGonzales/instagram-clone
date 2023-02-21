import { onAuthStateChanged, signInWithEmailAndPassword, signOut} from 'firebase/auth'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { auth } from '../firebase-config.js'
const Login = () => {
    const [loginEmail, setLoginEmail] = useState("")
    const [loginPassword, setLoginPassword] = useState("")
    const [user, setUser] = useState({})
    useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        })
    })
    const login = async (e) => {
        try {
            const user = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
            console.log(await user)

        } catch (error) {
            e.preventDefault();
            console.log(error.code)
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
                <Link to={"/main"} state={{ user: loginEmail, email: loginPassword}} >
                    <button onClick={login}>Login</button>
                </Link>
            </div>
            <div id='loginInfo'>
                <h4>User Logged In: {user?.email}</h4>
                <button onClick={logout}>Sign Out</button>
            </div>
        </>)
}
export default Login;