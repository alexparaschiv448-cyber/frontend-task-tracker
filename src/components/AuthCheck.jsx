import {Navigate,useNavigate,useLocation} from "react-router-dom";
import {useEffect, createContext, useState, useContext} from "react";
import FetchWrapper from "../assets/FetchWrapper.jsx";
import {context} from "./Context.jsx";
import {status_code} from "../assets/ProjectSettings.jsx";


export const user_context = createContext(null);

export default function AuthCheck({children}){
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const nav=useNavigate();
    const [name,setName]=useState("");
    const [email,setEmail]=useState("");
    const [id,setId]=useState("");
    const [created_at,setCreated_at]=useState("");
    const [authorized,setAuthorized]=useState(false);

    const {toast_message,message_status,loading_status,show_toast,set_toast}=useContext(context);
    const [message,setMessage]=toast_message;
    const [status,setStatus]=message_status;


    useEffect(() => {
        setLoading(true);
        setMessage("");
        setStatus("");
        if(sessionStorage.getItem("authorization")) {
            async function check() {
                const results= await FetchWrapper("/me",
                    "POST",
                    {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionStorage.getItem("authorization")}`
                },{
                    authorization: sessionStorage.getItem("authorization"),
                });
                if (results.status===401 && results.result.code=== status_code["401"]) {
                    sessionStorage.clear()

                    nav("/login", {
                        state: {
                            toastMessage: results.result.message,
                            toastStatus: "error"
                        },
                        replace: true
                    });
                }else if(results.status===200 && results.result.code=== status_code["200"][4]){
                    setName(results.result.data.firstname+" "+results.result.data.lastname);
                    setEmail(results.result.data.email);
                    setId(results.result.data.id);
                    setCreated_at(results.result.data.createdat);
                    setAuthorized(true);
                }
                setLoading(false);
            }

            check();
        }else{
            setName("");
            setEmail("");
            setId("");
            setCreated_at("");
            setAuthorized(false);
            setLoading(false);
        }

    },[location.pathname])




    if(!loading){
        if((location.pathname ==="/login" || location.pathname ==="/register")&& authorized){
            return <Navigate to={"/error"} replace></Navigate>;}
        else if(location.pathname !=="/" && location.pathname !=="/login" && location.pathname !=="/register" && location.pathname !=="/error" && (!authorized)){
            return <Navigate to={"/error"} replace></Navigate>;}

        return <user_context.Provider value={{"user_name":[name,setName],"user_email":[email,setEmail],"user_id":[id,setId],"user_creation_date":[created_at,setCreated_at],"user_loading":[loading,setLoading]}}>{children}</user_context.Provider>
    }else{
        return null;
    }
}
