import '../index.css'
import {use, useState} from 'react';
import {useContext,useEffect} from "react";
import Context, {context} from "../components/Context.jsx";
import PageLayout from "../components/PageLayout.jsx";
import {useNavigate} from "react-router-dom";
import {user_context} from "../components/AuthCheck.jsx";
import FetchWrapper from "../assets/FetchWrapper.jsx";


export default function Dashboard() {
    const nav=useNavigate();
    const {a,b,c}=useContext(context);
    const {na,em}=useContext(user_context);
    const [message,setMessage]=b;
    const [status,setStatus]=c;
    const [name,setName]=na;
    const[email, setEmail] = em;

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
                sessionStorage.setItem("authorization", result.token);
                setName(result.firstname+" "+result.lastname);
                setEmail(result.email);

            } catch (error) {
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
                result = await response.json().catch(() => ({}));
                if (response.status === 401 && result.detail==="Token Expired") {
                    alert(result.detail);
                    sessionStorage.clear();
                    setName("");
                    setEmail("");
                    nav("/login");
                }
            }catch(error){
                setMessage("Error: "+error.message);
                setStatus("error");
                setTimeout(() => {
                    setMessage("");setStatus("");
                }, 3000);
            }
        }
        check();
    }
    async function CheckFetch(){
        const token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.myJmaXJzdG5hbWUiOiJBbGV4IiwibGFzdG5hbWUiOiJQIiwiZW1haWwiOiJhbGV4QHlhaG9vLmNvbSIsImV4cCI6MTc3NTE5OTY5OX0.957gK1UviXzG9O8RwEfGGlzn0Hlv8ikWatTMsfu2vJw";
        const result= await FetchWrapper("http://localhost:8000/me",
            "POST",
            {"Content-Type": "application/json","Authorization": `Bearer ${token}`},
            {
                authorization: token
            }
            )
        const result2 = await FetchWrapper("http://localhost:8000/checkemail/alex@yahoo.com","GET");
        const result3 = await FetchWrapper("http://localhost:8000/conn","GET",{"Content-Type": "application/json","Authorization": `Bearer ${token}`});
        setMessage("Status: "+result3.status);
        setStatus("success");
        setTimeout(() => {
            setMessage("");setStatus("");
        }, 3000);
    }
    return(
        <>
            <PageLayout>
                <button onClick={HandleClick}>Set test</button>
                <br/>
                <button onClick={()=>{sessionStorage.clear();
                    setName("");
                    setEmail("");
                    setLoading(false);
                }}>Remove test</button>
                <br/>
                <button onClick={CheckAuth}>Check test</button>
                <br/>
                <br/>
                <br/>
                <button onClick={CheckFetch}>Check fetch wrapper</button>
                <h1>User is: {name? name:''}</h1>
                {name ? <h1>Welcome {name}!</h1> : <h1>Welcome guest!</h1>}
            </PageLayout>
        </>
    )
}