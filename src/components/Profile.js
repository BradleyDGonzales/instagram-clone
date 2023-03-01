import { Link, useLocation } from "react-router-dom";
import Header from "./Header";
import { auth, db } from '../firebase-config.js'
import { Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot, query, where } from "firebase/firestore";

const Profile = () => {
    const location = useLocation();
    const { displayName } = location.state
    let user = [];
    const [currentUser, setCurrentUser] = useState('')
    useEffect(() => {
        const usersRef = collection(db, "users")
        const q = query(usersRef, where("username", "==", displayName));
        onSnapshot(q, (snapshot) => {
            user = [];
            snapshot.docs.map((doc) => {
                console.log(doc.data())
                user.push({ ...doc.data() })
            })
            setCurrentUser(user);
        })

    }, [])
    return (currentUser === '' ? <div>loading...</div> :
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
                        <li>{currentUser[0].postsCount} posts</li>
                        <li>{currentUser[0].followers.length} followers</li>
                        <li>{currentUser[0].following.length} following</li>
                    </div>
                    <div className="test" id="myProfilePersonalInfo" >
                        <li>{currentUser[0].fullName ? currentUser[0].fullName : `@${currentUser[0].username}`}</li>
                        <li>Bio</li>
                        <li>My Website</li>
                    </div>

                </div>
            </div>
        </>)
}
export default Profile;