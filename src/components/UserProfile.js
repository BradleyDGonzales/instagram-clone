import { addDoc, arrayRemove, arrayUnion, collection, doc, getDoc, onSnapshot, query, Query, setDoc, updateDoc, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { auth, db } from "../firebase-config";
import Header from "./Header";

const UserProfile = () => {
    const location = useLocation();
    let user = [{}]
    const { userOfInterest } = location.state;
    const { displayName } = location.state;
    console.log(location.state);
    const [currentUser, setCurrentUser] = useState([]);

    useEffect(() => {
        const usersRef = collection(db, "users")
        const q = query(usersRef, where("username", "==", userOfInterest));
        onSnapshot(q, (snapshot) => {
            user = [];
            snapshot.docs.map((doc) => {
                console.log(doc.data())
                user.push({ ...doc.data() })
            })
            setCurrentUser(user);
        })
    }, [])

    const handleFollowButton = async () => {
        if (document.getElementById('followButton').textContent === 'Follow') {
            const docRef = doc(db, "users", auth.currentUser.email);
            await updateDoc(docRef, {
                following: arrayUnion(userOfInterest)
            })
            document.getElementById('followButton').textContent = 'Following'
        }
        else {
            const docRef = doc(db, "users", auth.currentUser.email);
            await updateDoc(docRef, {
                following: arrayRemove(userOfInterest)
            })
            document.getElementById('followButton').textContent = 'Follow'
        }
    }
    const handleFollowButtonText = async () => {
        const docRef = doc(db, "users", auth.currentUser.email);
        const docSnap = await getDoc(docRef)
        if (docSnap.data().following.includes(userOfInterest)) {
            document.getElementById('followButton').textContent = 'Following'
        }
        else {
            document.getElementById('followButton').textContent = 'Follow'
        }
    }
    useEffect(() => {
        handleFollowButtonText();
    })
    return (currentUser.length === 0 ? <div>test</div> :
        <>
            <Header displayName={displayName} />
            <div id="mainContainer" >
                <div id="myProfileWrapper">
                    <div className="test" id="myProfileHeader">
                        <h4>@{currentUser[0].username}</h4>
                        <Button id="followButton" onClick={() => handleFollowButton()} className='btn btn-secondary'></Button>
                    </div>
                    <div className="test" id="myProfileStats">
                        <li>4 posts</li>
                        <li>{currentUser[0].followers} followers</li>
                        <li>{currentUser[0].following} following</li>
                    </div>
                    <div className="test" id="myProfilePersonalInfo" >
                        <li>{currentUser[0].fullName ? currentUser[0].fullName : `@${currentUser[0].username}`}</li>
                        <li>Bio</li>
                        <li>My Website</li>
                    </div>

                </div>
            </div>

        </>
    )
}
export default UserProfile;