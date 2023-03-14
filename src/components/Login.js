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
                    <Link to={"/main"} >
                        <button className='btn btn-secondary' id='loginButton' onClick={login}>Login</button>
                    </Link>
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
                    <button onClick={logout}>Sign Out</button>
                </div>
            </div>
        </div>)
    //     <div id='signUpContainer'>
    //     <div id='signUpBox'>
    //         <img width={200} height={75} src={logo} alt="font_logo" />
    //         <h2 id='signUpBoxText'>Sign up to see photos and videos from friends, family, and other people across the world! </h2>
    //         <div className='input-group' id="accountDetails">
    //             <Form id="myForm">
    //                 <Form.Group className='mb-3'>
    //                     <Form.Control onChange={(e) => setRegisterEmail(e.target.value)} size='sm' type='email' placeholder='Email' />
    //                 </Form.Group>
    //                 <Form.Group className='mb-3'>
    //                     <Form.Control onChange={(e) => setFullName(e.target.value)} size='sm' type='text' placeholder='Full name' />
    //                 </Form.Group>
    //                 <Form.Group className='mb-3'>
    //                     <Form.Control onChange={(e) => setUserName(e.target.value)} size='sm' type='text' placeholder='Username' />
    //                 </Form.Group>
    //                 <Form.Group className='mb-3'>
    //                     <Form.Control onChange={(e) => setRegisterPassword(e.target.value)} size='sm' type='password' placeholder='Password' />
    //                 </Form.Group>
    //                 <Link onClick={(e) => register(e)} to={'/main'} >
    //                     <Button className='btn btn-secondary'>Sign Up</Button>
    //                 </Link>


    //             </Form>

    //         </div>
    //     </div>
    //     <div id="loginRoute">
    //         <span>Have an account?
    //             <Link to={"/login"} >
    //                 &nbsp;Log in
    //             </Link>
    //         </span>
    //     </div>

    // </div>
}
export default Login;