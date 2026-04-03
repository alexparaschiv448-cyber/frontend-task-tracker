import {useRef, useEffect, useState, useContext} from 'react';
import {useNavigate} from "react-router-dom";
import Input from './Input';
import Toast from './Toast';
import {context} from "./Context.jsx";
import {user_context} from "./AuthCheck.jsx";
import FetchWrapper from "../assets/FetchWrapper.jsx"
export default function RegisterForm() {
    const nav=useNavigate();

    const[firstName, setFirstName] = useState('');
    const[lastName, setLastName] = useState('');
    const[email, setEmail] = useState('');
    const[password, setPassword] = useState('');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const {a,b,c}=useContext(context);
    const [message,setMessage]=b;
    const [status,setStatus]=c;
    const [disabled,setDisabled]=useState(false);

    function statusMessage(m,s){
        setMessage(m);
        setStatus(s);
    }
    console.log("First name: ",firstName);
    console.log("Last name: ",lastName);
    console.log(email.length);

    function validateName(name){
        if(name.length>30){
            return "Name too long!";
        }
        for (let i = 0; i < name.length; i++) {
            const char = name[i];

            if (
                !(char >= 'a' && char <= 'z') &&
                !(char >= 'A' && char <= 'Z') && (char===' ')
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
        if (email.length>0){
            for (let i = 0; i < email.length; i++) {
                const char = email[i];
                if(char==='@'){return false}
            }
            return "Incorrect email format!";
        }
        return false;

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
            setData(Object.values(r.result.message));

        }
        //checkEmail();
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
        if(!validateName(firstName) && !validateEmail(email) && !validatePassword(password) && !validateName(lastName) && email!=='' && password!=='' && lastName!=='' && firstName!=='' && data.length===0){
            //alert("Yes");
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

                    //alert("User successfully registered!");
                    //nav("/");
                    //setData(result);
                    setLoading(false);
                    setData(true);
                    setMessage("User successfully registered!");
                    setStatus("success");
                    console.log("tee");
                    setTimeout(() => {
                        setMessage("");setStatus("");console.log("tee2");
                        setDisabled(true);
                        //sessionStorage.setItem("name",result.firstname+" "+result.lastname);
                        //sessionStorage.setItem("email",result.email);
                        sessionStorage.setItem("authorization",r.result.token);
                        nav("/");
                    }, 2000);
                } catch (error) {
                    //console.error("Error:", error);
                    alert(error);
                }finally {
                    setLoading(false);
                }
            };
            sendPostRequest();
            //setStatus("error");
            //setMessage("Invalid data!");
            //console.log(status+" "+message);

        }else{
            console.log("tee");
            setMessage("Invalid data!");
            setStatus("error");
            setTimeout(() => {
                setMessage("");setStatus("");
            }, 3000);
        }

        //nav("/");
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
                {loading ? <p className="text-sm text-gray-500 mt-1 h-5 ml-4">Loading</p>:<br/>}
            </form>

        </>
    )
}