import { useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth'
import { auth } from '../firebase-config.js'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css'
import logo from '../images/instagram_font_logo.png'
import image1 from '../images/carousel_img1.jpg'
import image2 from '../images/carousel_img2.jpg'
import empty_screen from '../images/empty_screen.png'
import { Link } from 'react-router-dom';


const carouselImages = [image1, image2]
const SignUp = () => {

    const [currentIndex, setCurrentIndex] = useState(0);
    useEffect(() => {
        const intervalID = setInterval(() => {
            if (currentIndex === carouselImages.length - 1) {
                setCurrentIndex(0);
            }
            else {
                setCurrentIndex(currentIndex + 1)
            }
        }, 4000)
        return () => clearInterval(intervalID);
    }, [currentIndex])


    const [registerEmail, setRegisterEmail] = useState("")

    const [registerPassword, setRegisterPassword] = useState("")


    const [userName, setUserName] = useState("");


    const [fullName, setFullName] = useState({})


    // useEffect(() => {
    //     onAuthStateChanged(auth, (currentUser) => {
    //         setUser(currentUser);

    //     })
    //     console.log(auth);
    // })



    const register = async (e) => {
        try {
            const user = await createUserWithEmailAndPassword(auth, registerEmail, registerPassword);
            const username = await updateProfile(auth.currentUser, { displayName: userName })

        } catch (error) {
            console.log(error.message);
        }

    }
    const logout = async () => {
        await signOut(auth);

    }



    return (
        <div id='signUpPage'>
            <div className="carousel">
                <img height={450} width={450} id='emptyScreen' src={empty_screen} alt="empty_screen" />
                <img height={430} width={300} id="carouselImage" src={carouselImages[currentIndex]} alt="carousel_image" />

            </div>
            <div id='signUpContainer'>
                <div id='signUpBox'>
                    <img width={200} height={75} src={logo} alt="font_logo" />
                    <h2 id='signUpBoxText'>Sign up to see photos and videos from friends, family, and other people across the world! </h2>
                    <div className='input-group' id="accountDetails">
                        <Form id="myForm">
                            <Form.Group className='mb-3'>
                                <Form.Control onChange={(e) => setRegisterEmail(e.target.value)} size='sm' type='email' placeholder='Email' />
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <Form.Control onChange={(e) => setFullName(e.target.value)} size='sm' type='text' placeholder='Full name' />
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <Form.Control onChange={(e) => setUserName(e.target.value)} size='sm' type='text' placeholder='Username' />
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <Form.Control onChange={(e) => setRegisterPassword(e.target.value)} size='sm' type='password' placeholder='Password' />
                            </Form.Group>
                            <Link onClick={(e) => register(e)} to={'/homepage'} state={{ userName: userName, email: registerEmail }} >
                                <Button className='btn btn-secondary'>Sign Up</Button>
                            </Link>


                        </Form>

                    </div>
                </div>
                <div id="loginRoute">
                    <span>Have an account? 
                        <Link to={"/login"} >
                            &nbsp;Log in
                        </Link>
                    </span>
                </div>

            </div>
            {/* <div>
                <h3>Login</h3>
                <input placeholder='Email' onChange={(event) => { setLoginEmail(event.target.value) }} />
                <input placeholder='Password' onChange={(event) => { setLoginPassword(event.target.value) }} />
                <button onClick={login}>Login</button>
            </div>
            <div id='loginInfo'>
                <h4>User Logged In: {user?.email}</h4>
                <button onClick={logout}>Sign Out</button>
            </div> */}

        </div >
    );
}
export default SignUp;
