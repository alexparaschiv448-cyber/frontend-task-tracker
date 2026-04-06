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



    useEffect(() => {

        if(sessionStorage.getItem("authorization")) {
            async function check() {
                const r= await FetchWrapper("http://localhost:8000/me",
                    "POST",
                    {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionStorage.getItem("authorization")}`
                },{
                    authorization: sessionStorage.getItem("authorization"),
                });
                if (r.status===401) {
                        sessionStorage.clear();
                        nav("/login");
                }else{
                    setName(r.result.firstname+" "+r.result.lastname);
                    setEmail(r.result.email);
                }
                setLoading(false);
            }

            check();
        }else{
            setLoading(false);
            setName("");
            setEmail("");
        }

    },[location.pathname])

    if(!loading){
        if((location.pathname ==="/login" || location.pathname ==="/register")&&(sessionStorage.getItem("authorization"))){
            return <Navigate to={"/error"} replace></Navigate>;}
        else if(location.pathname !=="/" && location.pathname !=="/login" && location.pathname !=="/register" && location.pathname !=="/error" && (!sessionStorage.getItem("authorization"))){
            return <Navigate to={"/error"} replace></Navigate>;}

        return <user_context.Provider value={{"na":[name,setName],"em":[email,setEmail]}}>{children}</user_context.Provider>
    }else{
        return null;
    }
}
