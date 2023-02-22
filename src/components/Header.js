import { Link, useLocation } from 'react-router-dom'
import logo from '../images/instagram_logo.png'
import homeLogo from '../images/home.svg'
import messagesLogo from '../images/messages.svg'
import newPostLogo from '../images/newPost.svg'
import profileLogo from '../images/profile.svg'
import logoutLogo from '../images/logout.svg'
import { auth, db } from '../firebase-config.js'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { useEffect, useState } from 'react'
import { collection, doc, getDoc, getDocs } from 'firebase/firestore'
const Header = ({ displayName }) => {
    const [currentUser, setCurrentUser] = useState();
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const docRef = doc(db, "users", user.email);

                    /* quota exceeded for tonight, thought about setting currentUser to the docSnap.data().username,
                       this way we can set the displayName to currentUser and not have to wait for displayName cuz 
                       it's always null upon registering an account. in short, get displayname from user's database (by email) and not from auth.currentUser.displayName
                       see line 67 to see a possible solution
                    */
                    const docSnap = await getDoc(docRef);

                    setCurrentUser(docSnap.data().username)
                    console.log(docSnap.data());
                }
                catch(error) {
                    console.log(error)
                }
            }
        })
    }, [])
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
    const logout = async (e) => {
        await signOut(auth)
    }


    return (
        <>


            <header>
                <img id='instagramLogoText' height={75} width={75} src={logo} alt="logo" />
                <div id="iconsContainer">
                    <Link to={"/main"}>
                        <img style={style} src={homeLogo} alt="homeLogo" id="homeLogo" />
                    </Link>
                    <img style={style} src={messagesLogo} alt="messagesLogo" id="messagesLogo" />
                    <Link to={"/upload"} state={{ displayName: auth.currentUser.displayName }} >
                        <img style={style} src={newPostLogo} alt="newPostLogo" id="newPostLogo" />
                    </Link>
                    <div className="menu">
                        <img onClick={() => handleProfileLogoClick()} style={style} src={profileLogo} alt="profileLogo" id="profileLogo" />
                        <div id='dropdownContainer'>
                            <div id="profileItem">
                                <img style={menuStyle} src={profileLogo} />
                                <Link to={"/profile"} state={{ displayName: auth.currentUser.displayName }}> 
                                {/* should probably not send anything in link but instead we can set the displayName to currentUser since we get the username from
                                db and not from auth.currentUser.displayName */}
                                    @{displayName} 
                                </Link>
                            </div>
                            <div id="signOutItem">
                                <img style={menuStyle} src={logoutLogo} />
                                <Link to={"/login"} onClick={logout}>
                                    Log Out
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

        </>
    )
}
export default Header;