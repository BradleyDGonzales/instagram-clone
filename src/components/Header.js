import { useLocation } from 'react-router-dom'
import logo from '../images/instagram_logo.png'

const Header = () => {

    return (
        <header>
            <img id='instagramLogoText' height={75} width={75} src={logo} alt="logo" />
        </header>
    )
}
export default Header;