import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import commentsIcon from '../images/messages.svg'
import { Link } from "react-router-dom";
import { auth, db } from '../firebase-config.js'
import Header from "./Header.js";
import profileIcon from '../images/profile.svg'
import searchIcon from '../images/magnify.svg'
import '../App.css'
import { addDoc, arrayRemove, arrayUnion, collection, collectionGroup, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import likeIcon from '../images/like.png'
import sendCommentIcon from '../images/send.svg'
import UserLikesModal from "./UserLikesModal";
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
    const [postsCommentsID, setPostsCommentsID] = useState([]);
    const [openLikesModal, setOpenLikesModal] = useState(false);
    const [likedByUsers, setLikedByUsers] = useState([]);
    let posts = [];
    let comments = []
    useEffect(() => {
        onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setLoading(false);
                console.log(auth.currentUser.displayName)
                let followedUsers = await getFollowedUsers(currentUser.email)
                if (followedUsers.length > 0) {
                    followedUsers[0].map(async (user) => {
                        const usersRef = query(collectionGroup(db, "posts"), where('user', '==', user));
                        const querySnapshot = await getDocs(usersRef);
                        querySnapshot.forEach((doc) => {
                            posts.push(doc.data());
                            comments.push(doc.id)
                        })
                        console.log(posts);
                        console.log(comments)
                        setUserPosts(posts);
                        await loadComments(comments)
                        console.log(userPosts)
                    })
                }
            }
            else {
                setLoading(true);
                window.location = "login"
            }
        })
    },[])
    const loadComments = async (comments) => {
        let testSnapshot = [];
        comments.map(async (comment) => {
            let flag = true;
            const test = query(collectionGroup(db, "comments"), where('postID', '==', comment));
            const testData = await getDocs(test).then(flag = false)
            testData.forEach((doc) => {
                testSnapshot.push(doc.data())
            })
            setPostsCommentsID(testSnapshot);
        });
        console.log(testSnapshot);
    }
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
        const q = query(docRef, where("email", "==", currentUser));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            followedUsers.push(doc.data().following);
        })
        console.log(followedUsers);
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
                console.log(parseInt(document.querySelector(`[data-imageurl="${imageURL}Likes"]`).textContent.substring(0, 1)))
                document.querySelector(`[data-imageurl="${imageURL}Likes"]`).textContent = parseInt(document.querySelector(`[data-imageurl="${imageURL}Likes"]`).textContent.substring(0, 1)) === 0 ? parseInt(document.querySelector(`[data-imageurl="${imageURL}Likes"]`).textContent) + 1 + " like" : parseInt(document.querySelector(`[data-imageurl="${imageURL}Likes"]`).textContent) + 1 + " likes"
            }
            else {
                await setDoc(docRef, {
                    likes: post.likes - 1,
                    liked_by_users: arrayRemove(auth.currentUser.displayName)
                }, { merge: true })
                console.log(parseInt(document.querySelector(`[data-imageurl="${imageURL}Likes"]`).textContent.substring(0, 1)))
                document.querySelector(`[data-imageurl="${imageURL}Likes"]`).textContent = parseInt(document.querySelector(`[data-imageurl="${imageURL}Likes"]`).textContent.substring(0, 1)) === 2 ? parseInt(document.querySelector(`[data-imageurl="${imageURL}Likes"]`).textContent) - 1 + " like" : parseInt(document.querySelector(`[data-imageurl="${imageURL}Likes"]`).textContent) - 1 + " likes"
            }
        })
    }
    const handleCommentClick = async (postID) => {
        console.log(postID)
        const currentPost = document.querySelector(`.addComment[data-postid="${postID}"]`)
        console.log(currentPost);
        currentPost.style.display = "flex";
        currentPost.style.gap = "8px";
    }
    const submitComment = async (imageURL) => {
        const postsRef = query(collectionGroup(db, "posts"), where('imageURL', '==', imageURL))
        const querySnapshot = await getDocs(postsRef);
        const queryData = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
        }))
        console.log(queryData);
        let postID = queryData[0].id;
        let currentPostEmail = queryData[0].email
        queryData.map(async (currentPost) => {
            const docRef = doc(db, `users`, currentPost.email);
            const colRef = collection(docRef, `posts/${currentPost.id}/comments`)
            await addDoc(colRef, {
                user: auth.currentUser.displayName,
                email: auth.currentUser.email,
                postCreatorEmail: currentPost.email,
                comment: comment,
                postID: currentPost.id,
                timestamp: serverTimestamp(),
            })
        })
        console.log(postID)
        console.log(currentPostEmail);
        const docRef = doc(db, 'users', currentPostEmail);
        const colRef = collection(docRef, 'posts', postID, 'comments');
        const test = await getDocs(colRef)
        console.log(test)
        test.forEach(async (aw) => {
            await setDoc(doc(db, 'users', currentPostEmail, 'posts', postID, 'comments', aw.id), {
                commentPostID: aw.id,
            }, { merge: true })
        })
    }
    const grabLikedByUsers = async (postID) => {
        setOpenLikesModal(true);
        const q = query(collectionGroup(db, "posts"), where("postID", "==", postID));
        const querySnapshot = await getDocs(q)
        querySnapshot.forEach((doc) => {
            setLikedByUsers(doc.data().liked_by_users)
        })
    }
    const handleRedirect = (userOfInterest, displayName) => {
        console.log(userOfInterest)
        console.log(displayName)
        if (userOfInterest === displayName) {
            return (<Link to={"/profile"} state={{ displayName: userOfInterest }}>@{userOfInterest}</Link>)
        }
        else {
            return (<Link to={"/userprofile"} acquiredUser={userOfInterest} state={{ userOfInterest: userOfInterest, displayName: userOfInterest }}>@{userOfInterest}</Link>)
        }

    }
    return (
        <>
            {loading ?
                <div className="test">
                    is this being rendered
                </div> :
                <>
                    <Header displayName={auth.currentUser.displayName} />
                    <div id="wrapper">
                        <div id="sideBarContainer">
                            <div id="sideSearchBar">
                                <input placeholder="Search by username.." onChange={(e) => setSearchText(e.target.value)} id="searchBar" type="text" />
                                <img onClick={() => handleSearch()} alt="searchIcon" style={pfpStyle} src={searchIcon} />
                                {searchedUsers.length === 0 ? null : searchedUsers.map((currentUser) => {
                                    return (
                                        <div className="profileCard">
                                            <img className="profilePicture" style={pfpStyle} alt="profilePicture" src={profileIcon} />
                                            <span className="profileUsername" >
                                                {handleRedirect(currentUser, auth.currentUser.displayName)}
                                            </span>
                                        </div>)
                                })}
                            </div>
                        </div>
                        <div id="cardsContainer">
                            {userPosts.map((post) => {
                                return (
                                    <div className="card text-white bg-dark mb-3">
                                        <div className="user">
                                            <img src={post?.photoURL} alt="avatar" className="postsAvatar" /><span><Link to="/userprofile" state={{ userOfInterest: post.user }}>@{post.user}</Link></span>
                                        </div>
                                        <img width={"300px"} src={post.imageURL} alt="userPost" />
                                        <div className="functionalities">
                                            <img className="likeIcon" data-postid={post.postID} data-imageurl={post.imageURL} width={"30px"} src={likeIcon} alt="likeIcon" onClick={(e) => handlePostLike(e.target.getAttribute("data-imageurl"))} />
                                            <img className="commentsLogo" data-postid={post.postID} data-imageurl={post.imageURL} width={"30px"} src={commentsIcon} alt="commentIcon" onClick={(e) => handleCommentClick(e.target.getAttribute("data-postid"))} />
                                        </div>
                                        <p onClick={() => grabLikedByUsers(post.postID)} className="postLikes" data-postid={post.postID} data-imageurl={`${post.imageURL}Likes`}>
                                            {post.likes === 1 ? `${post.likes} like` : `${post.likes} likes`}
                                        </p>
                                        <UserLikesModal likedByUsers={likedByUsers} onClose={() => setOpenLikesModal(false)} open={openLikesModal} />
                                        <p>{<strong><Link to="/userprofile" state={{ userOfInterest: post.user }}>{post.user}</Link></strong>} {post.caption}</p>
                                        <div className="postComments" data-postid={post.postID}>
                                            {postsCommentsID.length === 0 ? null : postsCommentsID.map((doc) => {
                                                if (doc.postID === post.postID) return (<p><strong><Link to="/userprofile" state={{ userOfInterest: doc.user }}>{doc.user}</Link></strong> {doc.comment}</p>)
                                            })}
                                        </div>
                                        <div className="addComment" data-postid={post.postID}>
                                            <input onChange={(e) => setComment(e.target.value)} type="text" placeholder="Add a comment" />
                                            <img data-imageurl={post.imageURL} alt="sendCommentIcon" onClick={(e) => submitComment(e.target.getAttribute("data-imageurl"))} width={"25px"} src={sendCommentIcon}></img>
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