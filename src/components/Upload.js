import { useLocation } from "react-router-dom";
import Header from "./Header";
import { useEffect, useState } from 'react';
import { auth, db, storage } from "../firebase-config";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { v4 } from 'uuid'
import { addDoc, collection, doc, getDoc, getDocs, serverTimestamp, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
const Upload = () => {
    const [imageUpload, setImageUpload] = useState(null);
    const [caption, setCaption] = useState('');
    let displayName;
    useEffect(() => {
        onAuthStateChanged(auth, async (currentUser) => {
            if (!currentUser) {
                window.location = "login"
            }
            else {
                displayName = auth.currentUser.displayName;
            }
        })
    })
    // const location = useLocation();
    const uploadImageToDatabase = async (url) => {
        const docRef = doc(db, "users", auth.currentUser.email);
        const colRef = collection(docRef, "posts")
        await addDoc(colRef, {
            imageURL: url,
            caption: caption,
            user: auth.currentUser.displayName,
            email: auth.currentUser.email,
            photoURL: auth.currentUser.photoURL,
            likes: 0,
            liked_by_users: [],
            comments: [],
            timestamp: serverTimestamp(),
        })
        const postID = await getDocs(colRef);
        postID.forEach(async (post) => {
            await setDoc(doc(db, "users", auth.currentUser.email, "posts", post.id), {
                postID: post.id,
            }, { merge: true })

        })
        const userRef = doc(db, "users", auth.currentUser.email);
        const userRefData = await getDoc(userRef)
        console.log(userRefData.data().postsCount)
        await setDoc(userRef, {
            postsCount: userRefData.data().postsCount + 1,
        }, { merge: true })

    }
    const uploadImage = async () => {
        if (imageUpload === null) return;
        const imageRef = ref(storage, `userImages/${imageUpload.name + v4()}`);
        console.log(imageUpload)
        uploadBytes(imageRef, imageUpload).then(async (snapshot) => {
            await getDownloadURL(snapshot.ref).then((url) => uploadImageToDatabase(url))
        })
    };
    return (
        <>
            <Header displayName={displayName} />
            <div className="uploadContainer">
                <div>
                    <input type={"file"} onChange={(event) => { setImageUpload(event.target.files[0]) }} />
                    <textarea onChange={(event) => setCaption(event.target.value)} id="captionBox" rows={7} cols={40} />
                    <button onClick={uploadImage}>Upload Image</button>
                </div>
            </div>
        </>)
}
export default Upload;