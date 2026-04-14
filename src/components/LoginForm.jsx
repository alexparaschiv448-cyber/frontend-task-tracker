import '../index.css'
import {useContext, useState} from 'react';
import Input from "./Input.jsx";
import {useNavigate} from "react-router-dom";
import {context} from "./Context.jsx";
import FetchWrapper from "../assets/FetchWrapper.jsx";

export default function LoginForm() {
    const nav=useNavigate();

    const[email, setEmail] = useState('');
    const[password, setPassword] = useState('');
    const {toast_message,message_status,loading_status}=useContext(context);
    const [loading, setLoading] = loading_status;
    const [message,setMessage]=toast_message;
    const [status,setStatus]=message_status;
    const [disabled,setDisabled]=useState(false);
    function validateEmail(email){
        if(email.length>30){
            return "Email too long!";
        }
        let checkAt=false;
        if (email.length>0){
            for (let i = 0; i < email.length; i++) {
                const char = email[i];
                if(char!=='@' && char!=='.' && !(char >= 'a' && char <= 'z') && !(char >= 'A' && char <= 'Z') || char===' '){return "Incorrect email format!";}
                if(char==='@'){checkAt=true;}
            }
        }else{return false;}
        if(checkAt){return false;}
        else{return "Incorrect email format!";}
    }
    function validatePassword(password){
        if(password.length>100){
            return "Password too long!";
        }
        return false;
    }
    function handleClick(){
        setDisabled(true);
        if(!validateEmail(email) && !validatePassword(password) &&  email!=='' && password!=='') {
            setLoading(true);
            const sendPostRequest = async () => {
                const r=await FetchWrapper("/auth/login",
                    "POST",
                    {
                    "Content-Type": "application/json",
                    },{
                        email: email,
                        password: password
                    });
                try {

                    setLoading(false);

                    if('message' in r.result){
                        setMessage("Invalid data!");
                        setStatus("error");
                        setTimeout(() => {
                            setMessage("");setStatus("");
                        }, 3000);
                    }else{
                        setMessage("User successfully logged in!");
                        setStatus("success");
                        setTimeout(() => {
                            setMessage("");setStatus("");
                            sessionStorage.setItem("authorization",r.result.token);
                            nav("/");
                        }, 2000);
                    }

                } catch (error) {
                    setMessage("Error: "+error.message);
                    setStatus("error");
                    setTimeout(() => {
                        setMessage("");setStatus("");
                    }, 3000);
                }finally {
                    setLoading(false);
                }
            };
            sendPostRequest();
        }else{
            setMessage("Invalid data!");
            setStatus("error");
            setTimeout(() => {
                setMessage("");setStatus("");
            }, 3000);
        }
        setDisabled(false);
    }
    return(
        <>
            <form onSubmit={(e) => e.preventDefault()}>
                <br/>
                <br/>
                <br/>
                <br/>
                <Input value={email} text={"Email address"} handleChange={(e) => setEmail(e.target.value)} type={"text"}/>
                {validateEmail(email) ? <p className="text-sm text-gray-500 mt-1 h-5 ml-4">
                    {validateEmail(email)}</p> : <br/>}
                <Input value={password} text={"Password"} handleChange={(e) => setPassword(e.target.value)} type={"password"}/>
                {validatePassword(password) ? <p className="text-sm text-gray-500 mt-1 h-5 ml-4">
                    {validatePassword(password)}</p> : <br/>}
                <button disabled={disabled} type="submit" onClick={handleClick} className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 m-4">Submit</button>
            </form>
        </>
    )
}