import '../index.css'
import { useState } from 'react';
import cImage from "../assets/c.png";
import {useContext} from "react";
import {context} from "../components/Context.jsx";
import PageHeader from "../components/PageLayout.jsx";
import PageLayout from "../components/PageLayout.jsx";
import {useNavigate} from "react-router-dom";


export default function Dashboard() {
    //const {state,setState} = useContext(context);
    //console.log(state);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const nav=useNavigate();
    function HandleClick(){
        let email="test@yahoo.com"
        let password="Test"
        setLoading(true);
        const getJWT = async () => {
            try {
                const response = await fetch("http://localhost:8000/auth/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password
                    }),
                });

                const result = await response.json();
                if (!response.ok) {
                    throw new Error("Error creating user!");
                }
                console.log(result);
                //alert("User successfully registered!");
                //nav("/");
                //setData(result);
                sessionStorage.setItem("authorization", result.token);
                sessionStorage.setItem("name", result.firstname+" "+result.lastname);
                sessionStorage.setItem("email", result.email);

            } catch (error) {
                //console.error("Error:", error);
                alert(error);
            }finally {
                setLoading(false);
            }
        };
        getJWT();

    }
    function CheckAuth(){
        const token = sessionStorage.getItem("authorization");
        let response;
        let result;
        async function check(){
            try{
                response = await fetch("http://localhost:8000/conn", {
                    method: "GET",
                    headers: {
                        "Authorization":`Bearer ${token}`
                    }
                });
                console.log(response.status);
                result = await response.json().catch(() => ({}));
                if (response.status === 401 && result.detail==="Token Expired") {
                    alert(result.detail);
                    sessionStorage.removeItem("authorization");
                    nav("/register");
                }
            }catch(error){
                console.error("Error:", error);
            }
        }
        check();
    }
    return(
        <>
            <PageLayout>
                    <button onClick={HandleClick}>Set test</button>
                    <br/>
                    <button onClick={()=>{if( sessionStorage.getItem("authorization")){sessionStorage.removeItem("authorization")}
                        if(sessionStorage.getItem("name")){sessionStorage.removeItem("name")}
                        if(sessionStorage.getItem("email")){sessionStorage.removeItem("email")}setLoading(false);
                    }}>Remove test</button>
                <br/>
                    <button onClick={CheckAuth}>Check test</button>
                    <h1>User is: {sessionStorage.getItem("authorization")? sessionStorage.getItem("authorization"):''}</h1>
            </PageLayout>
        </>
    )
}