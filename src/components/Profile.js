import { Link, useLocation } from "react-router-dom";
import Header from "./Header";
import { auth } from '../firebase-config.js'
import { Button } from "react-bootstrap";

const Profile = () => {
    const location = useLocation();
    const { displayName } = location.state
    return (
        <>
            <Header displayName={displayName} />
            <div id="mainContainer" >
                <div id="myProfileWrapper">
                    <div className="test" id="myProfileHeader">
                        <h4>@{displayName}</h4>
                        <Link to={"/edit_profile"}>
                            <Button className='btn btn-secondary'>Edit Profile</Button>
                        </Link>
                    </div>
                    <div className="test" id="myProfileStats">
                        <li>4 posts</li>
                        <li>517 followers</li>
                        <li>448 following</li>
                    </div>
                    <div className="test" id="myProfilePersonalInfo" >
                        <li>Full Name</li>
                        <li>Bio</li>
                        <li>My Website</li>
                    </div>

                </div>
            </div>
        </>)
}
export default Profile;