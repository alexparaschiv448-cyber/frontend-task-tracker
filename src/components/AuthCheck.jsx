import {Navigate,useNavigate,useLocation} from "react-router-dom";
import {useEffect, createContext, useState, useContext} from "react";
import FetchWrapper from "../assets/FetchWrapper.jsx";
import {context} from "./Context.jsx";
import {status_code} from "../assets/ProjectSettings.jsx";
import Loader from "./Loading"
import Loading from "./Loading";


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
    const [toastMessage,setToastMessage]=useState("");

    const {toast_message,message_status}=useContext(context);
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
                    setAuthorized(false);
                    setToastMessage(results.result.message);
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



            if((location.pathname==="/login" || location.pathname==='/register') && !location.state && authorized && sessionStorage.getItem("authorization")){
                return <Navigate to={"/error"} replace={true}></Navigate>;}
            else if ((location.pathname === "/login" && location.state || location.pathname === "/register" && location.state) && authorized && !loading) {
                if(location.pathname==="/login"){
                    return <user_context.Provider value={{
                        "user_name": ['', setName],
                        "user_email": ['', setEmail],
                        "user_id": ['', setId],
                        "user_creation_date": ['', setCreated_at],
                        "user_loading": [loading, setLoading]
                    }}> {loading ? null :children}</user_context.Provider>

                }
                else {
                    return <Navigate to={"/login"} replace={true}
                                     state={{toastMessage: "Unauthorized access!", toastStatus: "error"}}></Navigate>;
                }
                } else if (location.pathname !== "/" && location.pathname !== "/login" && location.pathname !== "/register" && location.pathname !== "/error" && (!authorized) && !loading) {
                sessionStorage.clear();
                return <Navigate to={"/login"} replace={true} state={{toastMessage:"Unauthorized access!",toastStatus:"error"}}></Navigate>;
            } else if(location.pathname==='/me'){
                return <user_context.Provider value={{
                    "user_name": [name, setName],
                    "user_email": [email, setEmail],
                    "user_id": [id, setId],
                    "user_creation_date": [created_at, setCreated_at],
                    "user_loading": [loading, setLoading]
                }}> {loading ? null : children}</user_context.Provider>
            }else {
                if(sessionStorage.getItem("authorization")){
                    return <user_context.Provider value={{
                        "user_name": [name, setName],
                        "user_email": [email, setEmail],
                        "user_id": [id, setId],
                        "user_creation_date": [created_at, setCreated_at],
                        "user_loading": [loading, setLoading]
                    }}> {children}</user_context.Provider>
                }else{
                    return <user_context.Provider value={{
                        "user_name": ['', setName],
                        "user_email": ['', setEmail],
                        "user_id": ['', setId],
                        "user_creation_date": ['', setCreated_at],
                        "user_loading": [loading, setLoading]
                    }}> {children}</user_context.Provider>
                }
            }
}
