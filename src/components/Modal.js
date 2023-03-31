import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useState } from "react";
import { storage } from "../firebase-config";

const Modal = ({ open, currentUser, onCancel, onClose, onApplyChanges, onDeleteAccountClick }) => {
    const [imageUpload, setImageUpload] = useState(null)
    if (!open) return null;
    console.log(currentUser);
    const pfpStyle = {
        fontSize: "12px",
        width: "fit-content",
    }
    
    if (imageUpload !== null) {
        console.log(imageUpload.name)
        // const imageRef = ref(storage, `userImages/${imageUpload.name + v4()}`);
        // console.log(imageUpload)
        // uploadBytes(imageRef, imageUpload).then(async (snapshot) => {
        //     await getDownloadURL(snapshot.ref).then((url) => uploadImageToDatabase(url))
        // })
    }
    return (
        <div className="modalContainer">
            <div className="modalRight">
                <p onClick={onClose} className="closeBtn">X</p>
            </div>
            <div className="modalContent">
                <div className="username">
                    <label htmlFor="username">Username:</label>
                    <input className="editInput" name="username" type="text" defaultValue={currentUser[0].username} />
                </div>
                <div className="name">
                    <label htmlFor="name">Name:</label>
                    <input className="editInput" name="name" type="text" defaultValue={currentUser[0].fullName} />
                </div>
                <div className="bio">
                    <label htmlFor="bio">Bio:</label>
                    <textarea className="editInput" name="bio" defaultValue={currentUser[0]?.bio} />
                </div>
                <div className="website">
                    <label htmlFor="website">Website:</label>
                    <input className="editInput" name="website" type="text" defaultValue={currentUser[0]?.website} />
                </div>
                <div className="profilePicture">
                    <label htmlFor="pfp">Change profile picture:</label>
                    <input onChange={(event) => { setImageUpload(event.target.files[0]) }} style={pfpStyle} id="pfpUpload" className="editInput" name="pfp" type="file" />
                </div>
                <div className="btnContainer">
                    <button id="applyEditsBtn" onClick={() => onApplyChanges(document.querySelectorAll('.editInput'), imageUpload)} className="btnPrimary btn btn-success">
                        Apply Changes
                    </button>
                    <button onClick={() => onCancel()} className="btnSecondary btn btn-secondary">
                        Cancel
                    </button>
                    <button onClick={() => onDeleteAccountClick()} id="deleteAccountBtn" className="btn btn-danger">Delete Account</button>
                </div>
            </div>
        </div>)
}
export default Modal;