import { useEffect } from "react";
import {useHistory, useLocation} from "react-router-dom"
const Homepage = () => {
    const location = useLocation()
    console.log(location);
    return(<div className="SADFSD">{location.state.userName}</div>);
}
export default Homepage;