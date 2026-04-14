import {Navigate,useNavigate,useLocation} from "react-router-dom";
import {useEffect, createContext, useState} from "react";
import FetchWrapper from "../assets/FetchWrapper.jsx";

export const user_context = createContext(null);

export default function AuthCheck({children}){
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const nav=useNavigate();
    const [name,setName]=useState("");
    const [email,setEmail]=useState("");
    const [id,setId]=useState("");
    const [created_at,setCreated_at]=useState("");



    useEffect(() => {

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
                if (results.status===401) {
                        sessionStorage.clear();
                        nav("/login");
                }else{
                    setName(results.result.firstname+" "+results.result.lastname);
                    setEmail(results.result.email);
                    setId(results.result.id);
                    setCreated_at(results.result.createdat);
                }
                setLoading(false);
            }

            check();
        }else{
            setLoading(false);
            setName("");
            setEmail("");
            setId("");
            setCreated_at("");
        }

    },[location.pathname])

    if(!loading){
        if((location.pathname ==="/login" || location.pathname ==="/register")&&(sessionStorage.getItem("authorization"))){
            return <Navigate to={"/error"} replace></Navigate>;}
        else if(location.pathname !=="/" && location.pathname !=="/login" && location.pathname !=="/register" && location.pathname !=="/error" && (!sessionStorage.getItem("authorization"))){
            return <Navigate to={"/error"} replace></Navigate>;}

        return <user_context.Provider value={{"user_name":[name,setName],"user_email":[email,setEmail],"user_id":[id,setId],"user_creation_date":[created_at,setCreated_at]}}>{children}</user_context.Provider>
    }else{
        return null;
    }
}
