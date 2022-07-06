import { Button } from "@material-ui/core";
import React from "react";
import { useFirebase } from "../../../components/FirebaseProvider";

const Home = () => {
    const { auth } = useFirebase();
    return <>
        <h1>Main Home - Welcome </h1>
        <Button onClick={(e) => {
            auth.signOut()
        }}>SignOut</Button>
    </>
}

export default Home;