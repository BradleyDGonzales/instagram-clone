import { Form, useLocation } from "react-router-dom";

const Modal = ({ open, currentUser, onClose, onApplyChanges }) => {
    if (!open) return null;
    console.log(currentUser);
    // const applyEdits = (values) => {
    //     for (let i = 0; i < values.length; i++) {
    //         console.log(values[i].value);
    //     }
        
    // }
    return <div className="overlay">
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
                <div className="btnContainer">
                    <button onClick={() => onApplyChanges(document.querySelectorAll('.editInput'))} className="btnPrimary">
                        Apply Changes
                    </button>
                    <button className="btnSecondary">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    </div>
}
export default Modal;