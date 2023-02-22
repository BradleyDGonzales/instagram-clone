import { useLocation } from "react-router-dom";
import Header from "./Header";
import {useEffect, useState} from 'react';
import { auth, storage } from "../firebase-config";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import {v4} from 'uuid'
const Upload = () => {
    const location = useLocation();
    const { displayName } = location.state;

    const [imageUpload, setImageUpload] = useState(null);
    const [caption, setCaption] = useState('');
    const uploadImage = () => {
        if (imageUpload === null) return;
        const imageRef = ref(storage,`userImages/${imageUpload.name + v4()}`);
        uploadBytes(imageRef, imageUpload).then(() => {
            alert('Image Uploaded');
        })
        getDownloadURL(ref(storage), `userImages/${imageUpload.name + v4()}`).then((url) => {
            alert(url)
        })
        
    };
    useEffect(() => {
        console.log(caption);
        console.log(auth.currentUser.uid)
    })
    return (
        <>
        <Header displayName={displayName} />
            <div className="uploadContainer">
                <div>
                    <input type={"file"} onChange={(event) => {setImageUpload(event.target.files[0],console.log(event.target.files[0]))}} />
                    <textarea onChange={(event) => setCaption(event.target.value)}  id="captionBox" rows={7} cols={40}/>
                    <button onClick={uploadImage}>Upload Image</button>
                </div>
            </div>
        </>)
}
export default Upload;