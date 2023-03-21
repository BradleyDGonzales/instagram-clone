import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { useEffect, useState } from 'react'
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom'
import { auth } from '../firebase-config.js'
import logo from '../images/instagram_font_logo.png'
const Login = () => {
    const [loginEmail, setLoginEmail] = useState("")
    const [loginPassword, setLoginPassword] = useState("")
    const [user, setUser] = useState({})

    useEffect(() => {
        onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                window.location = "main"
            }
        })
    })
    const login = async (e) => {
        try {
            return await signInWithEmailAndPassword(auth, loginEmail, loginPassword).then((firebaseUser) => {
                window.location = "main"
            })

        } catch (error) {
            e.preventDefault();
            console.log(error.code)
        }

    }

    const logout = (e) => {
        signOut(auth);
    }

    return (
        <div id="main">

            <div id='loginPageContainer'>
                <div id='loginInfoContainer'>
                    <img width={200} height={75} src={logo} alt="logo" />
                    <Form id='loginForm'>
                        <Form.Group className='mb-3'>
                            <Form.Control onChange={(e) => setLoginEmail(e.target.value)} size='sm' type='email' placeholder='Email' />
                        </Form.Group>
                        <Form.Group className='mb-3'>
                            <Form.Control onChange={(e) => setLoginPassword(e.target.value)} size='sm' type='password' placeholder='Password' />
                        </Form.Group>

                    </Form>
                    {/* <Link to={"/main"} > */}
                        <button className='btn btn-secondary' id='loginButton' onClick={() => login()}>Login</button>
                    {/* </Link> */}
                </div>
                <div id="signUpRoute">
                    <span>Don't have an account?
                        <Link to={"/"} >
                            &nbsp;Sign Up
                        </Link>
                    </span>
                </div>
                <div>
                    <h4>User Logged In: {user?.email}</h4>
                    <button onClick={() => logout()}>Sign Out</button>
                </div>
            </div>
        </div>)
}
export default Login;