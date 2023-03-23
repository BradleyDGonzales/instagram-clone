import { onAuthStateChanged } from "firebase/auth";
import { arrayRemove, arrayUnion, collection, collectionGroup, doc, getDoc, getDocs, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { auth, db } from "../firebase-config";
import Header from "./Header";

const UserProfile = () => {
    const location = useLocation();
    if (location.state === null) {
        window.location = "login"
    }
    let user = []
    let posts = []
    const { userOfInterest } = location.state;
    const { displayName } = location.state;
    console.log(userOfInterest, displayName);
    const [currentUser, setCurrentUser] = useState('');
    const [userPosts, setUserPosts] = useState([]);

    useEffect(() => {
        const usersRef = collection(db, "users")
        const q = query(usersRef, where("username", "==", userOfInterest));
        onSnapshot(q, async (snapshot) => {
            user = [];
            snapshot.docs.map((doc) => {
                user.push({ ...doc.data() })
            })
            setCurrentUser(user);
            const userRef = collection(db, "users", user[0].email, "posts");
            const userRefData = await getDocs(userRef)
            userRefData.forEach((doc) => {
                posts.push(doc.data())
            })
            console.log(posts);
            setUserPosts(posts);
        })
    }, []);



    const handleFollowButton = async () => {
        const userDocRef = doc(db, "users", currentUser[0].email);
        const docRef = doc(db, "users", auth.currentUser.email);
        if (document.getElementById('followButton').textContent === 'Follow') {
            await updateDoc(docRef, {
                following: arrayUnion(userOfInterest)
            });
            await updateDoc(userDocRef, {
                followers: arrayUnion(auth.currentUser.displayName)
            })
            document.getElementById('followButton').textContent = 'Following'
        }
        else {
            await updateDoc(docRef, {
                following: arrayRemove(userOfInterest),
            })
            await updateDoc(userDocRef, {
                followers: arrayRemove(auth.currentUser.displayName),
            })
            document.getElementById('followButton').textContent = 'Follow'
        }
    }
    const handleFollowButtonText = async () => {
        const docRef = doc(db, "users", auth.currentUser.email);
        const docSnap = await getDoc(docRef).then((doc) => {
            if (doc.data().following.includes(userOfInterest)) {
                document.getElementById('followButton').textContent = 'Following'
            }
            else {
                document.getElementById('followButton').textContent = 'Follow'
            }
        })
    }
    useEffect(() => {
        onAuthStateChanged(auth, () => {
            handleFollowButtonText();
        })
    });
    return (currentUser === '' ? <div>loading...</div> :
        <>
            <Header displayName={displayName} />
            <div id="mainContainer" >
                <div id="userProfile">
                    <div id="userProfileWrapper">
                        <img className="avatar" id="userAvatar" src={currentUser[0].photoURL} alt="avatar" />
                        <div className="test" id="userHeader">
                            <h4>@{currentUser[0].username}</h4>
                            <Button id="followButton" onClick={() => handleFollowButton()} className='btn btn-secondary'></Button>
                        </div>
                        <div className="test" id="userStats">
                            <li><strong>{currentUser[0].postsCount}</strong> posts</li>
                            <li><strong>{currentUser[0].followers.length}</strong> followers</li>
                            <li><strong>{currentUser[0].following.length}</strong> following</li>
                        </div>
                        <div className="test" id="userPersonalInfo" >
                            <li>{currentUser[0].fullName ? currentUser[0].fullName : `@${currentUser[0].username}`}</li>
                            <li>Bio</li>
                            <li>My Website</li>
                        </div>
                    </div>
                </div>
                <div id="userPostsWrapper">
                    <div id="userPosts">
                        {userPosts.length > 0 ? userPosts.map((post) => {
                            return (<img src={post.imageURL} alt="post" width="300" height="300"></img>)
                        }) : null}
                    </div>
                </div>
            </div>
        </>
    )
}
export default UserProfile;