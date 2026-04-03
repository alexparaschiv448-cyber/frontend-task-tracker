import {Navigate,useNavigate,useLocation} from "react-router-dom";
import {useEffect, useContext, createContext, useState} from "react";
import {context} from "./Context.jsx";
import FetchWrapper from "../assets/FetchWrapper.jsx";

export const user_context = createContext(null);

export default function AuthCheck({children}){
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const nav=useNavigate();
    const [name,setName]=useState("");
    const [email,setEmail]=useState("");
    const [status,setStatus]=useState(200);



    //if(sessionStorage.getItem("name")){setName(sessionStorage.getItem("name"));sessionStorage.removeItem("name");}
    //if(sessionStorage.getItem("email")){setEmail(sessionStorage.getItem("email"));sessionStorage.removeItem("email");}
    useEffect(() => {
        //const token = sessionStorage.getItem("authorization");
        //console.log(location.pathname ==="/login" || location.pathname ==="/register");
        let response;
        let result;

        console.log("IN USE EFFECT AUTCHCHECK");
        if(sessionStorage.getItem("authorization")) {
            console.log("Test2");
            async function check() {
                //setLoading(true);
                const r= await FetchWrapper("http://localhost:8000/me",
                    "POST",
                    {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionStorage.getItem("authorization")}`
                },{
                    authorization: sessionStorage.getItem("authorization"),
                });
                //console.log(result);
                if (r.status===401) {
                        //setStatus(401);

                        //setEmail("");
                        //setName("");
                        sessionStorage.clear();
                        nav("/login");
                        //alert("Unauthorized! Login to access!");
                }else{
                    setName(r.result.firstname+" "+r.result.lastname);
                    setEmail(r.result.email);
                    console.log("DATA SET");
                }
                setLoading(false);
            }

            check();
            console.log("auth: "+sessionStorage.getItem("authorization"));
        }else{
            setLoading(false);
            console.log("No Auth");
            setName("");
            setEmail("");
        }

    },[location.pathname])

    if(!loading){
        //if(status===401){return <Navigate to={"/login"} replace></Navigate>;}

        if((location.pathname ==="/login" || location.pathname ==="/register")&&(sessionStorage.getItem("authorization"))){
            console.log("bb1");return <Navigate to={"/error"} replace></Navigate>;}
        else if(location.pathname !=="/" && location.pathname !=="/login" && location.pathname !=="/register" && location.pathname !=="/error" && (!sessionStorage.getItem("authorization"))){
            console.log("aa1");return <Navigate to={"/error"} replace></Navigate>;}

        return <user_context.Provider value={{"na":[name,setName],"em":[email,setEmail]}}>{children}</user_context.Provider>
    }else{
        return null;
    }
}
