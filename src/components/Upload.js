import { useLocation, useResolvedPath } from "react-router-dom";
import Header from "./Header";
import { useEffect, useState } from 'react';
import { auth, db, storage } from "../firebase-config";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { v4 } from 'uuid'
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
const Upload = () => {
    const location = useLocation();
    const { displayName } = location.state;
    const [imageUpload, setImageUpload] = useState(null);
    const [caption, setCaption] = useState('');
    const uploadImageToDatabase = async (url) => {
        const docRef = doc(db, "users", auth.currentUser.email);
        const colRef = collection(docRef, "posts")
        await addDoc(colRef, {
            imageURL: url,
            caption: caption,
            user: auth.currentUser.displayName,
            email: auth.currentUser.email,
            likes: 0,
            liked_by_users: [],
            comments: [],
        })

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