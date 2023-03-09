import { Link, useLocation } from "react-router-dom";
import Header from "./Header";
import { auth, db } from '../firebase-config.js'
import { Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { arrayRemove, arrayUnion, collection, collectionGroup, doc, getDoc, getDocs, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import Modal from "./Modal";

const Profile = () => {
    const location = useLocation();
    const { displayName } = location.state
    let user = [];
    const [currentUser, setCurrentUser] = useState('')
    const [openModal, setOpenModal] = useState(false);
    useEffect(() => {
        onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                const usersRef = collection(db, "users")
                const q = query(usersRef, where("email", "==", currentUser.email));
                onSnapshot(q, (snapshot) => {
                    user = [];
                    snapshot.docs.map((doc) => {
                        user.push({ ...doc.data() })
                    })
                    setCurrentUser(user);
                })

            }
        })

    }, [])
    const applyEdits = async (values) => {
        console.log(values)
        values.forEach(async (value) => {
            if (value.name === 'username' && value.value !== '') {
                const prevUsername = auth.currentUser.displayName

                await updateProfile(auth.currentUser, {displayName: value.value})
                await updateDoc(doc(db, "users", auth.currentUser.email), {
                    username: value.value
                })

                //changes the username to the new username in comments
                const comments = query(collectionGroup(db, "comments"), where('user', '==', prevUsername));
                const commentsData = await getDocs(comments)
                let currentCommentsData = [];
                commentsData.forEach(async (comment) => {
                    console.log(comment.data())
                    currentCommentsData.push(comment.data())
                })
                currentCommentsData.map(async (comment) => {
                    await updateDoc(doc(db, "users", comment.postCreatorEmail, "posts", comment.postID, "comments", comment.commentPostID), {
                        user: value.value
                    })
                })

                //changes the username to the new username in following

                const following = query(collectionGroup(db, "users"), where('following', 'array-contains', prevUsername));
                const followingData = await getDocs(following);
                let currentUserData = [];
                followingData.forEach(async (following) => {
                    currentUserData.push(following.data())
                })
                currentUserData.map(async (user) => {
                    await updateDoc(doc(db, "users", user.email), {
                        following: arrayRemove(prevUsername),
                    })
                    await updateDoc(doc(db, "users", user.email), {
                        following: arrayUnion(value.value),
                    })
                })

                //changes the username to the new username in followers
                const followers = query(collectionGroup(db, "users"), where('followers', 'array-contains', prevUsername));
                const followersData = await getDocs(followers);
                currentUserData = [];
                followersData.forEach((async (follower) => {
                    currentUserData.push(follower.data())
                }))
                currentUserData.map(async (user) => {
                    await updateDoc(doc(db, "users", user.email), {
                        followers: arrayRemove(prevUsername),
                    })
                    await updateDoc(doc(db, "users", user.email), {
                        followers: arrayUnion(value.value),
                    })
                })

                //changes the user to the new username in posts
                const posts = query(collectionGroup(db, "posts"), where('user', '==', prevUsername));
                const postsData = await getDocs(posts);
                currentUserData = [];
                postsData.forEach((async (post) => {
                    currentUserData.push(post.data())
                }))
                currentUserData.map(async (user) => {
                    await updateDoc(doc(db, "users", user.email, "posts", user.postID), {
                        user: value.value
                    })
                })

                //changes the user to the new username in posts liked_by_users field
                const likedByUsers = query(collectionGroup(db, "posts"), where('liked_by_users', 'array-contains', prevUsername));
                const likedByUsersData = await getDocs(likedByUsers);
                let testData = []
                likedByUsersData.forEach(async (post) => {
                    testData.push(post.data())
                })
                console.log(testData)
                testData.map(async (post) => {
                    await updateDoc(doc(db, "users", post.email, "posts", post.postID), {
                        liked_by_users: arrayRemove(prevUsername),
                    })
                    await updateDoc(doc(db, "users", post.email, "posts", post.postID), {
                        liked_by_users: arrayUnion(value.value),
                    })
                })


            }
            else if (value.name === 'name') {
                await updateDoc(doc(db, "users", auth.currentUser.email), {
                    fullName: value.value
                })
            }
            else if (value.name === 'bio') {
                await updateDoc(doc(db, "users", auth.currentUser.email), {
                    bio: value.value
                })
            }
            else if (value.name === 'website') {
                await updateDoc(doc(db, "users", auth.currentUser.email), {
                    website: value.value
                })
            }
        })
    }
    return (currentUser === '' ? <div>loading...</div> :
        <>
            <Header displayName={displayName} />
            <div id="mainContainer" >
                <div id="myProfileWrapper">
                    <div className="test" id="myProfileHeader">
                        <h4>@{currentUser[0].username}</h4>
                        {/* <Link to={"/edit_profile"} state={{currentUser: currentUser}}> */}
                        <Button onClick={() => setOpenModal(true)} className='modalBtn btn btn-secondary'>Edit Profile</Button>
                        <Modal onApplyChanges={applyEdits} onCancel={() => setOpenModal(false)} onClose={() => setOpenModal(false)} currentUser={currentUser} open={openModal} />
                        {/* </Link> */}
                    </div>
                    <div className="test" id="myProfileStats">
                        <li>{currentUser[0].postsCount} posts</li>
                        <li>{currentUser[0].followers.length} followers</li>
                        <li>{currentUser[0].following.length} following</li>
                    </div>
                    <div className="test" id="myProfilePersonalInfo" >
                        <li>{currentUser[0].fullName ? currentUser[0].fullName : `@${currentUser[0].username}`}</li>
                        <li>{currentUser[0].bio}</li>
                        <li>{currentUser[0].website}</li>
                    </div>

                </div>
            </div>
        </>)
}
export default Profile;