import {Navigate,useNavigate,useLocation} from "react-router-dom";
import NavButton from "./NavButton";
import {context} from "./Context.jsx";
import {useContext, useState,useEffect} from "react";
import Toast from "./Toast";
import {user_context} from "./AuthCheck.jsx";

export default function NavBar(){
    //let name='';
    //let email='';
    const {na,em}=useContext(user_context);
    const [name,setName]=na;
    const[email, setEmail] = em;
    const {a,b,c}=useContext(context);
    const [message,setMessage]=b;
    const [status,setStatus]=c;
    let nav=useNavigate();
    const Location=useLocation();


    useEffect(() => {
        setMessage("");
        setStatus("");
    }, [location.pathname]);
    //if(sessionStorage.getItem("name")  && sessionStorage.getItem("email")){
    //    name=sessionStorage.getItem("name")
    //    email=sessionStorage.getItem("email");
   // }
    console.log("Status: "+!!status);
    return(
        <>
            <div className="w-full h-[7vh] bg-blue-900 flex items-center justify-between px-6">

                {/* Left side buttons */}
                <div className="flex space-x-3">
                    <Toast type={status} message={message}  show={!!status}/>
                    <NavButton clickHandler={()=>{nav("/");}} text="Dashboard"/>
                    <NavButton clickHandler={()=>{nav("/register");}} text="Register"/>
                    <NavButton clickHandler={()=>{nav("/login");}} text="Login"/>
                    <NavButton clickHandler={()=>{
                        setMessage("Successfully logged out!");
                        setStatus("success");console.log(status);


                            //setName("");setEmail("");

                            //setMessage("");
                            //setStatus("");
                            console.log(status);
                        setTimeout(() => {
                            setMessage("");
                            setStatus("");
                            sessionStorage.clear();
                            nav("/login");
                        }, 2000);
                    }} text="Logout"/>
                    <NavButton clickHandler={()=>{nav("/me");}} text="Profile"/>
                </div>

                <div className="text-right text-white">
                    <p className="font-semibold">{name}</p>
                    <p className="text-sm text-blue-200">{email}</p>
                </div>

            </div>
        </>
    )

}