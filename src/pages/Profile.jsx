import '../index.css'

import PageLayout from "../components/PageLayout";
import RegisterForm from "../components/RegisterForm";
import {useContext} from "react";
import {user_context} from "../components/AuthCheck.jsx";

export default function Register() {
    const {na,em}=useContext(user_context);
    const [name,setName]=na;
    const[email, setEmail] = em;
    return(
        <>
            <PageLayout>
                <h1>Username: {name}</h1>
                <br/>
                <br/>
                <br/>
                <h1>Email: {email}</h1>
                <br/>
                <br/>
            </PageLayout>
        </>
    )
}