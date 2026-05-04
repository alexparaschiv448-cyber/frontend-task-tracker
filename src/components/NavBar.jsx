import {useNavigate} from "react-router-dom";
import NavButton from "./NavButton";
import {context} from "./Context.jsx";
import {useContext,useEffect} from "react";
import Toast from "./Toast";
import {user_context} from "./AuthCheck.jsx";
import {useLocation} from "react-router-dom";

export default function NavBar(){
    const {user_name,user_email,user_loading}=useContext(user_context);
    const [name,setName]=user_name;
    const[email, setEmail] = user_email;
    const[loading, setLoading] = user_loading;
    const {toast_message,message_status,loading_status,show_toast,set_toast}=useContext(context);
    const [message,setMessage]=toast_message;
    const [status,setStatus]=message_status;
    let nav=useNavigate();
    let location = useLocation();


    return(
        <>
            <div className="w-full h-[7vh] bg-blue-900 flex items-center justify-between px-6">

                <div className="flex space-x-3">
                    <NavButton clickHandler={()=>{if(location.pathname!=="/"){nav("/");}}} text="Dashboard"/>
                    <NavButton clickHandler={()=>{if(location.pathname!=="/register"){nav("/register");}}} text="Register"/>
                    <NavButton clickHandler={()=>{if(location.pathname!=="/login"){nav("/login");}}} text="Login"/>
                    <NavButton clickHandler={()=>{
                        setLoading(true);
                        sessionStorage.clear();
                        nav("/login", {
                            state: {
                                toastMessage: "Successfully logged out!",
                                toastStatus: "success"
                            },
                            replace: true
                        });
                    }} text="Logout"/>
                    <NavButton clickHandler={()=>{if(location.pathname!=="/me"){nav("/me");}}} text="Profile"/>
                    <NavButton clickHandler={()=>{if(location.pathname!=="/projects"){nav("/projects");}}} text="Projects"/>
                </div>

                <div className="text-right text-white">
                    <p className="font-semibold">{name}</p>
                    <p className="text-sm text-blue-200">{email}</p>
                </div>

            </div>
        </>
    )

}