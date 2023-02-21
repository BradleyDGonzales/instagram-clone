import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { auth } from '../firebase-config.js'
import Header from "./Header.js";
const Main = () => {
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        console.log(auth);
        onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setLoading(false)
            }
            else {
                setLoading(true);
            }
        })
    })
    console.log(loading)
    return (
        <>
            {loading ?
                <div>
                    is this being true
                </div> :
                <>
                    <Header displayName={auth.currentUser.displayName} />
                    <div className="test">teasdfdjlk;</div>
                </>}

        </>
    );
}

export default Main;