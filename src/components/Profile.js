import { Link, useLocation } from "react-router-dom";
import Header from "./Header";
import { auth, db } from '../firebase-config.js'
import { Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { collection, doc, getDoc, getDocs, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import Modal from "./Modal";

const Profile = () => {
    const location = useLocation();
    const { displayName } = location.state
    let user = [];
    const [currentUser, setCurrentUser] = useState('')
    const [openModal, setOpenModal] = useState(false);
    // onAuthStateChanged(auth, async (currentUser) => {
    //     if (currentUser) {
    //         setLoading(false);
    //         let followedUsers = await getFollowedUsers(currentUser.displayName)
    //         followedUsers[0].map(async (user) => {
    //             const usersRef = query(collectionGroup(db, "posts"), where('user', '==', user));
    //             const querySnapshot = await getDocs(usersRef);
    //             querySnapshot.forEach((doc) => {
    //                 posts.push(doc.data());
    //                 comments.push(doc.id)
    //             })
    //             console.log(posts);
    //             console.log(comments)
    //             setUserPosts(posts);
    //             await loadComments(comments)
    //         })

    //     }
    //     else {
    //         setLoading(true);
    //     }
    // })
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
                await updateDoc(doc(db, "users", auth.currentUser.email), {
                    username: value.value
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
        // const docRef = doc(db, "users", auth.currentUser.email);
        // console.log(currentUser);
        // await getDoc(docRef).then((doc) => setCurrentUser(doc.data()))
        // let newData = []
        // const docRefData = await getDoc(docRef).then((doc) => newData.push(doc.data()))
        // setCurrentUser(newData);
        // docRefData.forEach((doc) => {
        //     console.log(doc.data())
        // })
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