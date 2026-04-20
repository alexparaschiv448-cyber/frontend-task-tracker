import '../index.css'
import {useContext} from "react";
import {context} from "../components/Context.jsx";
import PageLayout from "../components/PageLayout.jsx";
import {useNavigate} from "react-router-dom";
import {user_context} from "../components/AuthCheck.jsx";
import FetchWrapper from "../assets/FetchWrapper.jsx";
import ProjectsChart from "../components/ProjectsChart.jsx";

export default function Dashboard() {
    const nav=useNavigate();

    const {toast_message,message_status,loading_status}=useContext(context);
    const [loading,setLoading]=loading_status;
    const [message,setMessage]=toast_message;
    const [status,setStatus]=message_status;
    const {user_name,user_email}=useContext(user_context);
    const [name,setName]=user_name;
    const[email, setEmail] = user_email;

    function HandleClick(){
        let email="test@yahoo.com"
        let password="Test"
        setLoading(true);
        const getJWT = async () => {
            try {
                const response = await fetch("/auth/login", {
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
                setMessage("Error: "+error.message);
                setStatus("error");
                setTimeout(() => {
                    setMessage("");setStatus("");
                }, 3000);
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
                response = await fetch("/conn", {
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

    return(
        <>
            <PageLayout>
            <ProjectsChart />
            </PageLayout>
        </>
    )
}