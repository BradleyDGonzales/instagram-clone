import { Link, useLocation } from 'react-router-dom'
import logo from '../images/instagram_logo.png'
import homeLogo from '../images/home.svg'
import messagesLogo from '../images/messages.svg'
import newPostLogo from '../images/newPost.svg'
import profileLogo from '../images/profile.svg'
import logoutLogo from '../images/logout.svg'
import { auth } from '../firebase-config.js'
import { signOut } from 'firebase/auth'
const Header = ({ displayName }) => {
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
        <header>
            <img id='instagramLogoText' height={75} width={75} src={logo} alt="logo" />
            <div id="iconsContainer">
                <Link to={"/main"}>
                    <img style={style} src={homeLogo} alt="homeLogo" id="homeLogo" />
                </Link>
                <img style={style} src={messagesLogo} alt="messagesLogo" id="messagesLogo" />
                <img style={style} src={newPostLogo} alt="newPostLogo" id="newPostLogo" />
                <div className="menu">

                    <img onClick={() => handleProfileLogoClick()} style={style} src={profileLogo} alt="profileLogo" id="profileLogo" />
                    <div id='dropdownContainer'>
                        <div id="profileItem">
                            <img style={menuStyle} src={profileLogo} /><Link to={"/profile"} state={{ displayName: auth.currentUser.displayName }} >@{displayName}</Link>
                        </div>
                        <div id="signOutItem">
                            <img style={menuStyle} src={logoutLogo} /><Link to={"/login"} onClick={logout}>Log Out</Link>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}
export default Header;