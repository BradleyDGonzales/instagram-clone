import { useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth } from '../firebase-config.js'
import Header from './Header';
import logo from '../images/instagram_font_logo.png'
import image1 from '../images/carousel_img1.jpg'
import image2 from '../images/carousel_img2.jpg'
import empty_screen from '../images/empty_screen.png'


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

    const [loginEmail, setLoginEmail] = useState("")

    const [loginPassword, setLoginPassword] = useState("")


    const [user, setUser] = useState({})


    useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        })
    })



    const register = async () => {
        try {

            const user = await createUserWithEmailAndPassword(auth, registerEmail, registerPassword);
            console.log(user)

        } catch (error) {
            console.log(error.message);
        }

    }
    const login = async () => {
        try {

            const user = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
            console.log(user)

        } catch (error) {
            console.log(error.message);
        }

    }
    const logout = async () => {
        await signOut(auth);

    }



    return (
        <div id='homepage'>
            <div className="carousel">
                <img height={450} width={450} id='emptyScreen' src={empty_screen} alt="empty_screen" />
                <img height={430} width={300} id="carouselImage" src={carouselImages[currentIndex]} alt="carousel_image" />

            </div>
            <div id='signUpBox'>
                <img width={200} height={75} src={logo} alt="font_logo" />
                <h2 id='signUpBoxText'>Sign up to see photos and videos from friends, family, and other people across the world! </h2>
                <div id="accountDetails">
                    <input placeholder='Email' />
                    <input placeholder="Full name" />
                    <input placeholder="Username" />
                    <input placeholder='Password' />
                    <button>Sign Up</button>
                </div>

            </div>

        </div >
    );
}




















{/* // <div classNameName="User">
        //     <div>
        //         <h3>Register User</h3>
        //         <input placeholder='Email' onChange={(event) => { setRegisterEmail(event.target.value) }} />
        //         <input placeholder='Password' onChange={(event) => { setRegisterPassword(event.target.value) }} />
        //         <button onClick={register}>Create User</button>
        //     </div>
        //     <div>
        //         <h3>Login</h3>
        //         <input placeholder='Email' onChange={(event) => { setLoginEmail(event.target.value) }} />
        //         <input placeholder='Password' onChange={(event) => { setLoginPassword(event.target.value) }} />
        //         <button onClick={login}>Login</button>
        //     </div>
        //     <h4>User logged in: {user?.email}</h4>
        //     <button onClick={logout} >Sign out</button>
        // </div> */}

export default SignUp;
