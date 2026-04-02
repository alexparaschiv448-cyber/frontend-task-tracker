import {Navigate,useNavigate,useLocation} from "react-router-dom";
import {useEffect, useContext, createContext, useState} from "react";
import {context} from "./Context.jsx";

export const user_context = createContext(null);

export default function AuthCheck({children}){
    const location = useLocation();
    const [loading, setLoading] = useState(false);
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
        setLoading(true);
        console.log("IN USE EFFECT AUTCHCHECK");
        if(sessionStorage.getItem("authorization")) {
            console.log("Test2");
            async function check() {
                try {
                    response = await fetch("http://localhost:8000/me", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${sessionStorage.getItem("authorization")}`
                        },
                        body: JSON.stringify({
                            authorization: sessionStorage.getItem("authorization"),
                        }),
                    });
                    result = await response.json().catch(() => ({}));
                    console.log(result);
                    if (response.status===401) {
                            //setStatus(401);

                            //setEmail("");
                            //setName("");
                            sessionStorage.clear();
                            nav("/login");
                            //alert("Unauthorized! Login to access!");
                    }else{
                        setName(result.firstname+" "+result.lastname);
                        setEmail(result.email);
                        console.log("DATA SET");
                    }
                } catch (error) {
                    console.error("Error:", error);
                }
            }

            check();
            console.log("auth: "+sessionStorage.getItem("authorization"));
        }else{
            console.log("No Auth");
            setName("");
            setEmail("");
        }
        setLoading(false);
    },[location.pathname])

    if(!loading){
        //if(status===401){return <Navigate to={"/login"} replace></Navigate>;}
        if((location.pathname ==="/login" || location.pathname ==="/register")&&(sessionStorage.getItem("authorization"))){
            console.log("bb1");return <Navigate to={"/error"} replace></Navigate>;}
        else if(location.pathname !=="/" && location.pathname !=="/login" && location.pathname !=="/register" && location.pathname !=="/error" && (!sessionStorage.getItem("authorization"))){
            console.log("aa1");return <Navigate to={"/error"} replace></Navigate>;}

        return <user_context.Provider value={{"na":[name,setName],"em":[email,setEmail]}}>{children}</user_context.Provider>
    }else{
        return '';
    }
}
