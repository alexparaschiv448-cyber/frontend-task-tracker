import '../index.css'
import {useContext, useState} from 'react';
import cImage from "../assets/c.png";
import PageLayout from "../components/PageLayout";
import Input from "./Input.jsx";
import {useNavigate} from "react-router-dom";
import {context} from "./Context.jsx";


export default function LoginForm() {
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
    function handleClick(){
        if(!validateEmail(email) && !validatePassword(password) &&  email!=='' && password!=='') {
            //alert("Yes");
            setLoading(true);
            const sendPostRequest = async () => {
                try {
                    const response = await fetch("http://localhost:8000/auth/login", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            email: email,
                            password: password
                        }),
                    });

                    const result = await response.json();
                    if (!response.ok) {
                        throw new Error("Error");
                    }
                    //alert("User successfully registered!");
                    //nav("/");
                    //setData(result);
                    setLoading(false);

                    console.log(result);
                    if('message' in result){
                        console.log("tee");
                        setMessage("Invalid data!");
                        setStatus("error");
                        setTimeout(() => {
                            setMessage("");setStatus("");
                        }, 3000);
                    }else{
                        setMessage("User successfully logged in!");
                        setStatus("success");
                        setTimeout(() => {
                            setMessage("");setStatus("");console.log("tee2");
                            sessionStorage.setItem("name",result.firstname+" "+result.lastname);
                            sessionStorage.setItem("email",result.email);
                            sessionStorage.setItem("authorization",result.token);
                            nav("/");
                        }, 2000);
                    }
                } catch (error) {
                    //console.error("Error:", error);
                    alert(error);
                }finally {
                    setLoading(false);
                }
            };
            sendPostRequest();
        }else{
            console.log("tee");
            setMessage("Invalid data!");
            setStatus("error");
            setTimeout(() => {
                setMessage("");setStatus("");
            }, 3000);
        }
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
                {loading ? <p className="text-sm text-gray-500 mt-1 h-5 ml-4">Loading</p>:<br/>}
            </form>
        </>
    )
}