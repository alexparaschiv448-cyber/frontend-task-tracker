import {Navigate,useNavigate,useLocation} from "react-router-dom";
import {useEffect} from "react";

export default function AuthCheck({children}){
    const location = useLocation();
    const nav=useNavigate();


    useEffect(() => {
        //const token = sessionStorage.getItem("authorization");
        //console.log(location.pathname ==="/login" || location.pathname ==="/register");
        let response;
        let result;

        if(sessionStorage.getItem("name") || sessionStorage.getItem("email") || sessionStorage.getItem("authorization")) {
            console.log("Test2");
            async function check() {
                try {
                    response = await fetch("http://localhost:8000/auth/check", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${sessionStorage.getItem("authorization")}`
                        },
                        body: JSON.stringify({
                            name: sessionStorage.getItem("name"),
                            email: sessionStorage.getItem("email"),
                            authorization: sessionStorage.getItem("authorization"),
                        }),
                    });
                    result = await response.json().catch(() => ({}));
                    console.log(result);
                    if ('message' in result) {
                        if (result.message === "Invalid credentials") {
                            alert("Credentials manually altered! Login again!")
                            sessionStorage.removeItem("name");
                            sessionStorage.removeItem("email");
                            sessionStorage.removeItem("authorization");
                            nav("/");
                        } else if (result.message === "Invalid token") {
                            alert("Invalid token! Login again!")
                            sessionStorage.removeItem("name");
                            sessionStorage.removeItem("email");
                            sessionStorage.removeItem("authorization");
                            nav("/");
                        }
                    }
                } catch (error) {
                    console.error("Error:", error);
                }
            }

            check();
        }
    },[])

    if((location.pathname ==="/login" || location.pathname ==="/register")&&(sessionStorage.getItem("name") && sessionStorage.getItem("email") && sessionStorage.getItem("authorization"))){return <Navigate to={"/error"} replace></Navigate>;}
    else if(location.pathname !=="/" && location.pathname !=="/login" && location.pathname !=="/register" && (!sessionStorage.getItem("name") && !sessionStorage.getItem("email") && !sessionStorage.getItem("authorization"))){
        return <Navigate to={"/error"} replace></Navigate>;}
    else if((!sessionStorage.getItem("name") || !sessionStorage.getItem("email") || !sessionStorage.getItem("authorization"))&&(sessionStorage.getItem("name") || sessionStorage.getItem("email") || sessionStorage.getItem("authorization"))){
        if(sessionStorage.getItem("name")){sessionStorage.removeItem("name");}
        if(sessionStorage.getItem("email")){sessionStorage.removeItem("email");}
        if(sessionStorage.getItem("authorization")){sessionStorage.removeItem("authorization");}
        nav("/");
    }
    return children;
}
