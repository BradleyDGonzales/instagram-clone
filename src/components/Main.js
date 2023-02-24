import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { auth, db } from '../firebase-config.js'
import Header from "./Header.js";
import profileLogo from '../images/profile.svg'
import searchLogo from '../images/magnify.svg'
import '../App.css'
import { collection, doc, getDocs } from "firebase/firestore";
const Main = () => {
    let currentArray = [];
    const pfpStyle = {
        height: "25px",
    }
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [searchedUsers, setSearchedUsers] = useState([]);
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
    const searchUser = () => {
        const usersColRef = collection(db, "users")
        const getUsers = async () => {
            const data = await getDocs(usersColRef);
            let tempArray = [];
            data.docs.map((doc) => {
                if (searchText === '') return;
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
        searchUser()
    })
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
                            <input onChange={(e) => setSearchText(e.target.value)} id="searchBar" type="text" />
                            <img onClick={() => handleSearch()} alt="searchLogo" style={pfpStyle} src={searchLogo} />
                            {searchedUsers.length === 0 ? null : searchedUsers.map((currentUser) => {
                                return (
                                <div className="profileCard">
                                    <img style={pfpStyle} alt="profilePicture" src={profileLogo} />
                                    <span>@{currentUser}</span>
                                </div>)

                            })}
                        </div>
                    </div>
                </>}

        </>
    );
}

export default Main;