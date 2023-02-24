import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { auth, db } from '../firebase-config.js'
import Header from "./Header.js";
import profileLogo from '../images/profile.svg'
import '../App.css'
import { collection, doc, getDocs } from "firebase/firestore";
const Main = () => {
    const pfpStyle = {
        height: "25px",
    }
    const [loading, setLoading] = useState(true)
    const [searchText, setSearchText] = useState("")
    useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setLoading(false)
            }
            else {
                setLoading(true);
            }
        })
    })
    const searchUser = (username) => {
        setSearchText(username);
        const usersColRef = collection(db, "users")
        const getUsers = async () => {
            const data = await getDocs(usersColRef);
            console.log(data.docs.map((doc) => {
                if (doc.data().username.includes(searchText)) {
                    console.log('asdfdsa')
                }
            }))
        }
        getUsers();
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
                        <div id="mainPage">
                            <input onChange={(e) => searchUser(e.target.value)} id="searchBar" type="text"></input>
                            <div className="profileCard">
                                <img style={pfpStyle} alt="profilePicture" src={profileLogo} />
                                <a href="#">@shyseus</a>
                            </div>
                        </div>
                    </div>
                </>}

        </>
    );
}

export default Main;