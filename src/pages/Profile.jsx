import '../index.css'

import PageLayout from "../components/PageLayout";
import RegisterForm from "../components/RegisterForm";

export default function Register() {
    return(
        <>
            <PageLayout>
                <h1>Username: {sessionStorage.getItem("name")}</h1>
                <br/>
                <br/>
                <br/>
                <h1>Email: {sessionStorage.getItem("email")}</h1>
                <br/>
                <br/>
            </PageLayout>
        </>
    )
}