import { Link } from 'react-router-dom'
import logo from '../images/instagram_logo.png'
import homeLogo from '../images/home.svg'
import newPostLogo from '../images/newPost.svg'
import profileLogo from '../images/profile.svg'
import logoutLogo from '../images/logout.svg'
import { auth, db } from '../firebase-config.js'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { Button } from 'react-bootstrap'
const Header = () => {
    const [currentUser, setCurrentUser] = useState();
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const docRef = doc(db, "users", user.email);
                    const docSnap = await getDoc(docRef);
                    try {
                        setCurrentUser(docSnap.data().username)
                    }
                    catch {
                        console.log('waiting for docSnap data..')
                    }
                }
                catch (error) {
                    console.log(error)
                }
            }
        })
    })
    const style = {
        width: '45px',
    }
    const menuStyle = {
        width: '30px'
    }
    const handleProfileLogoClick = () => {
        const dropdownContainer = document.getElementById('dropdownContainer');
        console.log(dropdownContainer.style.getPropertyPriority('display'));
        dropdownContainer.style.display === "" ? dropdownContainer.style.display = "block" : dropdownContainer.style.display = "";
    }
    const logout = async () => {
        await signOut(auth).then(window.location = "login")
    }
    return (
        <>
            <header>
                <img id='instagramLogoText' height={75} width={75} src={logo} alt="logo" />
                <div id="iconsContainer">
                    <Link to={"/main"}>
                        <img style={style} src={homeLogo} alt="homeLogo" id="homeLogo" />
                    </Link>
                    <Link to={"/upload"} state={{ displayName: currentUser }} >
                        <img style={style} src={newPostLogo} alt="newPostLogo" id="newPostLogo" />
                    </Link>
                    <div className="menu">
                        <img onClick={() => handleProfileLogoClick()} style={style} src={profileLogo} alt="profileLogo" id="profileLogo" />
                        <div id='dropdownContainer'>
                            <div id="profileItem">
                                <img alt="profileLogo" style={menuStyle} src={profileLogo} />
                                <Link to={"/profile"} state={{ displayName: currentUser }}>
                                    @{currentUser}
                                </Link>
                            </div>
                            <div id="signOutItem">
                                <img alt="logoutLogo" style={menuStyle} src={logoutLogo} />
                                <button id="logoutBtn" onClick={() => logout(auth)} >Log Out</button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}
export default Header;