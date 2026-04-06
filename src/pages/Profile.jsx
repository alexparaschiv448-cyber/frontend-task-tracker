import '../index.css'
import PageLayout from "../components/PageLayout";
import {useContext} from "react";
import {user_context} from "../components/AuthCheck.jsx";

export default function Register() {
    const {user_name,user_email}=useContext(user_context);
    const [name,setName]=user_name;
    const[email, setEmail] = user_email;
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