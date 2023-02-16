import { useLocation } from 'react-router-dom'
import logo from '../images/instagram_logo.png'
import homeLogo from '../images/home.svg'
import messagesLogo from '../images/messages.svg'
import newPostLogo from '../images/newPost.svg'
import profileLogo from '../images/profile.svg'
const Header = ({displayName}) => {
    const style = {
        width: '45px',
    }
    return (
        <header>
            <img id='instagramLogoText' height={75} width={75} src={logo} alt="logo" />
            <h5>{displayName}</h5>
            <div id="iconsContainer">
                <img style={style} src={homeLogo} alt="homeLogo" />
                <img style={style}src={messagesLogo} alt="messagesLogo" />
                <img style={style}src={newPostLogo} alt="newPostLogo" />
                <img style={style}src={profileLogo} alt="profileLogo" />
            </div>
        </header>
    )
}
export default Header;