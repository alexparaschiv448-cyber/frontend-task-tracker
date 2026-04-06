import {useNavigate} from "react-router-dom";
import NavButton from "./NavButton";
import {context} from "./Context.jsx";
import {useContext,useEffect} from "react";
import Toast from "./Toast";
import {user_context} from "./AuthCheck.jsx";

export default function NavBar(){
    const {user_name,user_email}=useContext(user_context);
    const [name,setName]=user_name;
    const[email, setEmail] = user_email;
    const {toast_message,message_status}=useContext(context);
    const [message,setMessage]=toast_message;
    const [status,setStatus]=message_status;
    let nav=useNavigate();


    useEffect(() => {
        setMessage("");
        setStatus("");
    }, [location.pathname]);
    return(
        <>
            <div className="w-full h-[7vh] bg-blue-900 flex items-center justify-between px-6">

                <div className="flex space-x-3">
                    <Toast type={status} message={message}  show={!!status}/>
                    <NavButton clickHandler={()=>{nav("/");}} text="Dashboard"/>
                    <NavButton clickHandler={()=>{nav("/register");}} text="Register"/>
                    <NavButton clickHandler={()=>{nav("/login");}} text="Login"/>
                    <NavButton clickHandler={()=>{
                        setMessage("Successfully logged out!");
                        setStatus("success");
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