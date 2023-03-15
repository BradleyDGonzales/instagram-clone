import { Link } from "react-router-dom";

const UserLikesModal = ({ open, likedByUsers, onClose }) => {
    console.log(likedByUsers)
    if (!open) return null;
    if (open) {
        document.getElementById('root').style.zIndex = "20"
        document.getElementById('root').style.backgroundColor = "rgba(0, 0, 0, 0.5)"
    }
    return (
        <div className="modalContainer">
            <div className="modalRight">
                <p onClick={onClose} className="closeBtn">X</p>
            </div>
            <div className="likedByUsers">

                {likedByUsers.length === 0 ? <div>No likes :/ be the first to like this post!</div> : likedByUsers.map((user) => {
                    return (<p className="user">

                        <Link to="/userprofile" state={{ userOfInterest: user }}>@{user}</Link>
                    </p>)
                })}
            </div>
        </div>
    )
}
export default UserLikesModal;