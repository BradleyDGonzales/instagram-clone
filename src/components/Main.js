import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth, db } from '../firebase-config.js'
import Header from "./Header.js";
import profileLogo from '../images/profile.svg'
import searchLogo from '../images/magnify.svg'
import '../App.css'
import { addDoc, collection, collectionGroup, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import likeLogo from '../images/like.png'
import sendMsgLogo from '../images/send.svg'
const Main = () => {
    let currentArray = [];
    const pfpStyle = {
        height: "25px",
    }
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [searchedUsers, setSearchedUsers] = useState([]);
    const [userPosts, setUserPosts] = useState([]);
    let followedUsers = []
    let posts = [];
    useEffect(() => {
        onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setLoading(false);
                let followedUsers = await getFollowedUsers(currentUser.displayName)
                followedUsers[0].map(async (user) => {
                    const usersRef = query(collectionGroup(db, "posts"), where('user', '==', user));
                    const querySnapshot = await getDocs(usersRef);
                    querySnapshot.forEach((doc) => {
                        posts.push(doc.data());
                    })
                    setUserPosts(posts);
                })



                // (async function() {
                //     const docRef = doc(db, "users", auth.currentUser.email);
                //     const q = query(docRef, where("username", "==", 'shyseus'))
                //     console.log(q);
                //     const colRef = collection(docRef, "posts");

                //     console.log(colRef);
                //     // await addDoc(colRef, {
                //     //     imageURL: url,
                //     //     caption: caption,
                //     //     user: auth.currentUser.displayName,
                //     //     likes: 0,
                //     //     liked_by_users: [],
                //     //     comments: [],
                //     // })
                // })();
            }
            else {
                setLoading(true);
            }
        })
    }, [])
    const searchUser = () => {
        const usersColRef = collection(db, "users")
        const getUsers = async () => {
            const data = await getDocs(usersColRef);
            let tempArray = [];
            data.docs.map((doc) => {
                if (!searchText) return;
                if (doc.data().username.includes(searchText)) {
                    tempArray.push(doc.data().username);
                    currentArray = tempArray;
                }
            })
        }
        getUsers();
    }
    const handleSearch = () => {
        setSearchedUsers(currentArray)
    }
    useEffect(() => {
        searchUser();
    })
    const getFollowedUsers = async (currentUser) => {
        let followedUsers = [];
        console.log(currentUser)
        const docRef = collection(db, "users");
        const q = query(docRef, where("username", "==", currentUser));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            followedUsers.push(doc.data().following);
        })
        return followedUsers;
    }
    const submitComment = async (imageURL) => {
        console.log(imageURL)
        const postsRef = query(collectionGroup(db, "posts"), where('imageURL', '==', imageURL));
        // postsRef.collection("comments").add({
        //     test: "test",
        // })
        // await addDoc(postsRef1,"comments", {comment: "test"} )
        // await setDoc(doc(db, "users", registerEmail), { email: registerEmail, password: registerPassword, username: userName, user_uid: auth.currentUser.uid, followers: [], following: [], postsCount: 0, fullName: fullName})
        const querySnapshot = await getDocs(postsRef)
        querySnapshot.forEach((doc) => {
        })
        await setDoc(postsRef, {
            test: "test"
        })
        // await addDoc(collection(postsRef, "comments"), {
        //     comment: "test"
        // });
        // const querySnapshot = await getDocs(usersRef);
        // querySnapshot.forEach((doc) => {
        //     posts.push(doc.data());
        // })
    }
    return (
        <>
            {loading ?
                <div className="test">
                    is this being rendered
                </div> :
                <>

                    <Header displayName={auth.currentUser.displayName} />
                    <div id="mainContainer">
                        <div id="sideSearchBar">
                            <input onChange={(e) => setSearchText(e.target.value)} id="searchBar" type="text" />
                            <img onClick={() => handleSearch()} alt="searchLogo" style={pfpStyle} src={searchLogo} />
                            {searchedUsers.length === 0 ? null : searchedUsers.map((currentUser) => {
                                return (
                                    <div className="profileCard">
                                        <img style={pfpStyle} alt="profilePicture" src={profileLogo} />
                                        <span>@<Link to="/userprofile" state={{ userOfInterest: currentUser, displayName: auth.currentUser.displayName }}>{currentUser}</Link></span>
                                    </div>)

                            })}
                        </div>
                        <div className="main test">
                            {userPosts.map((post) => {
                                return (
                                    <div className="card text-white bg-dark mb-3">
                                        <p>@{post.user}</p>
                                        <img width={"200px"} src={post.imageURL} alt="userPost" />
                                        <img data-imageurl={post.imageURL} width={"50px"} src={likeLogo} alt="likeLogo"></img>
                                        <p>{post.likes} likes</p>
                                        <p>{post.caption}</p>
                                        <div id="addComment">
                                            <input type="text" placeholder="Add a comment" />
                                            <img data-imageurl={post.imageURL} alt="sendMsgLogo" onClick={(e) => submitComment(e.target.getAttribute("data-imageurl"))} width={"25px"} src={sendMsgLogo}></img>
                                        </div>
                                    </div>)
                            })}
                        </div>
                    </div>
                </>}

        </>
    );
}

export default Main;