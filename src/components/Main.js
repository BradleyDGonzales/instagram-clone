import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth, db } from '../firebase-config.js'
import Header from "./Header.js";
import profileLogo from '../images/profile.svg'
import searchLogo from '../images/magnify.svg'
import '../App.css'
import { addDoc, arrayRemove, arrayUnion, collection, collectionGroup, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
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
    const [comment, setComment] = useState("");
    const [postsCommentsID, setPostsCommentsID] = useState([])

    let posts = [];
    let comments = []
    let postsComments = [];
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
                        comments.push(doc.id)
                    })
                    console.log(posts);
                    setUserPosts(posts);
                    comments.map(async (comment) => {
                        const test = query(collectionGroup(db, "comments"), where('postID', '==', comment));
                        const testSnapshot = await getDocs(test);
                        testSnapshot.forEach((doc) => {
                            postsComments.push(doc.data())
                            console.log(postsComments);
                        })
                        setPostsCommentsID(postsComments);
                    })
                })
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
    const handlePostLike = async (imageURL) => {
        console.log(imageURL);
        const postsRef = query(collectionGroup(db, "posts"), where('imageURL', '==', imageURL));
        const querySnapshot = await getDocs(postsRef)
        const queryData = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
        }));
        queryData.map(async (post) => {
            const docRef = doc(db, `users`, post.email, "posts", post.id);
            if (!post.liked_by_users.includes(auth.currentUser.displayName)) {
                await setDoc(docRef, {
                    likes: post.likes + 1,
                    liked_by_users: arrayUnion(auth.currentUser.displayName)
                }, { merge: true })
                document.querySelector(`[data-imageurl="${imageURL}Likes"]`).textContent = parseInt(document.querySelector(`[data-imageurl="${imageURL}Likes"]`).textContent) + 1 + " Likes"
                
            }
            else {
                await setDoc(docRef, {
                    likes: post.likes - 1,
                    liked_by_users: arrayRemove(auth.currentUser.displayName)
                }, { merge: true })
                document.querySelector(`[data-imageurl="${imageURL}Likes"]`).textContent = parseInt(document.querySelector(`[data-imageurl="${imageURL}Likes"]`).textContent) - 1 + " Likes"
            }


        })

    }
    const submitComment = async (imageURL) => {
        const postsRef = query(collectionGroup(db, "posts"), where('imageURL', '==', imageURL));
        const querySnapshot = await getDocs(postsRef);
        const queryData = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
        }))
        console.log(queryData);
        queryData.map(async (post) => {
            const docRef = doc(db, `users`, post.email);
            const colRef = collection(docRef, `posts/${post.id}/comments`)
            await addDoc(colRef, {
                user: auth.currentUser.displayName,
                comment: comment,
                postID: post.id
            })
        })
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
                                        <img width={"300px"} src={post.imageURL} alt="userPost" />
                                        <img className="likeLogo" data-imageurl={post.imageURL} width={"30px"} src={likeLogo} alt="likeLogo" onClick={(e) => handlePostLike(e.target.getAttribute("data-imageurl"))} />
                                        <p className="postLikes" data-imageurl={`${post.imageURL}Likes`} >{post.likes} likes</p>
                                        <p>{<strong>{post.user}</strong>} {post.caption}</p>
                                        {postsCommentsID.length === 0 ? null : postsCommentsID.map((doc) => {
                                            return (<p><strong>{doc.user}</strong> {doc.comment}</p>)
                                        })}
                                        <div id="addComment">
                                            <input onChange={(e) => setComment(e.target.value)} type="text" placeholder="Add a comment" />
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