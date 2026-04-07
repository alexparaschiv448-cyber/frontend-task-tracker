import {useEffect, useState, useContext} from 'react';
import {useNavigate} from "react-router-dom";
import Input from './Input';
import {context} from "./Context.jsx";
import FetchWrapper from "../assets/FetchWrapper.jsx"
export default function RegisterForm() {
    const nav=useNavigate();

    const[firstName, setFirstName] = useState('');
    const[lastName, setLastName] = useState('');
    const[email, setEmail] = useState('');
    const[password, setPassword] = useState('');
    const [data, setData] = useState(null);

    const [error, setError] = useState(null);
    const {toast_message,message_status,loading_status}=useContext(context);
    const [loading, setLoading] = loading_status;
    const [message,setMessage]=toast_message;
    const [status,setStatus]=message_status;
    const [disabled,setDisabled]=useState(false);


    function validateName(name){
        if(name.length>30){
            return "Name too long!";
        }
        for (let i = 0; i < name.length; i++) {
            const char = name[i];

            if (
                !(char >= 'a' && char <= 'z') &&
                !(char >= 'A' && char <= 'Z') || (char===' ')
            ) {
                return "No symbols, spaces or numbers!";
            }
        }
        return false;
    }



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






    useEffect(() => {
        async function checkEmail() {
            const r= await FetchWrapper("http://localhost:8000/checkemail/"+email);
            setData(r.result.unique);

        }
        const timer = setTimeout(() => {
            if (email) checkEmail();
        }, 500);
        const controller = new AbortController();
        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [email]);





    function handleClick(){
        if(!validateName(firstName) && !validateEmail(email) && !validatePassword(password) && !validateName(lastName) && email!=='' && password!=='' && lastName!=='' && firstName!=='' && data){
            setLoading(true);
            const sendPostRequest = async () => {
                try {
                    const r=await FetchWrapper("http://localhost:8000/auth/register",
                        "POST",
                        {
                            "Content-Type": "application/json",
                        },{
                            firstName: firstName,
                            lastName: lastName,
                            email: email,
                            passwordHash: password
                        });
                    setLoading(false);
                    setData(true);
                    setMessage("User successfully registered!");
                    setStatus("success");
                    setTimeout(() => {
                        setMessage("");setStatus("")
                        setDisabled(true);
                        sessionStorage.setItem("authorization",r.result.token);
                        nav("/");
                    }, 2000);
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

    }

    return (
        <>
            <form onSubmit={(e) => e.preventDefault()}>
                <br/>
                <br/>
                <br/>
                <br/>
                <Input value={firstName} text={"First Name"} handleChange={(e) => setFirstName(e.target.value)} type={"text"}/>
                {validateName(firstName) ? <p className="text-sm text-gray-500 mt-1 h-5 ml-4">
                    {validateName(firstName)}
                </p> :<br/>}
                <Input value={lastName} text={"Last Name"} handleChange={(e) => setLastName(e.target.value)} type={"text"}/>
                {validateName(lastName) ? <p className="text-sm text-gray-500 mt-1 h-5 ml-4">
                    {validateName(lastName)}
                </p> :<br/>}
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