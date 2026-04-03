import '../index.css'
import {use, useState} from 'react';
import cImage from "../assets/c.png";
import {useContext,useEffect} from "react";
import Context, {context} from "../components/Context.jsx";
import PageHeader from "../components/PageLayout.jsx";
import PageLayout from "../components/PageLayout.jsx";
import {useNavigate} from "react-router-dom";
import {user_context} from "../components/AuthCheck.jsx";
import FetchWrapper from "../assets/FetchWrapper.jsx";


export default function Dashboard() {
    //const {state,setState} = useContext(context);
    //console.log(state);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const nav=useNavigate();
    const {a,b,c}=useContext(context);
    const {na,em}=useContext(user_context);
    const [name,setName]=na;
    const[email, setEmail] = em;
    const [message,setMessage]=b;
    const [status,setStatus]=c;

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
                //sessionStorage.setItem("name", result.firstname+" "+result.lastname);
                //sessionStorage.setItem("email", result.email);
                setName(result.firstname+" "+result.lastname);
                setEmail(result.email);

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
                    sessionStorage.clear();
                    setName("");
                    setEmail("");
                    //sessionStorage.removeItem("name");
                    //sessionStorage.removeItem("email");
                    nav("/login");
                }
            }catch(error){
                console.error("Error:", error);
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
        //console.log(result);
        const result2 = await FetchWrapper("http://localhost:8000/checkemail/alex@yahoo.com","GET");
        //console.log(result2);
        const result3 = await FetchWrapper("http://localhost:8000/conn","GET",{"Content-Type": "application/json","Authorization": `Bearer ${token}`});
        console.log(result3);
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