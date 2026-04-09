import {useEffect, useState, useContext} from 'react';
import {useNavigate} from "react-router-dom";
import Input from './Input';
import {context} from "./Context.jsx";
import {user_context} from "./AuthCheck.jsx";
import ProfileInput from "./ProfileInput.jsx"
import FetchWrapper from "../assets/FetchWrapper.jsx"
export default function RegisterForm() {
    const {user_name,user_email,user_id,user_creation_date}=useContext(user_context);
    const [name,setName]=user_name;
    const[email, setEmail] = user_email;
    const [id, setId]=user_id;
    const [created_at,setCreated_at]=user_creation_date;

    const [inputFirstName,setInputFirstName]=useState(name.split(" ")[0]);
    const [inputLastName,setInputLastName]=useState(name.split(" ")[1]);
    const [inputEmail,setInputEmail]=useState(email);
    const [readonlyFirst,setReadonlyFirst]=useState(true);
    const [readonlyLast,setReadonlyLast]=useState(true);
    const [readonlyEmail,setReadonlyEmail]=useState(true);
    const [canSubmit,setCanSubmit]=useState(false);
    const [uniqueEmail,setUniqueEmail]=useState(true);

    const {toast_message,message_status,loading_status}=useContext(context);
    const [loading, setLoading] = loading_status;
    const [message,setMessage]=toast_message;
    const [status,setStatus]=message_status;
    const nav=useNavigate();
    useEffect(() => {
        if(inputEmail!==email) {
            async function checkEmail() {
                const r = await FetchWrapper("/checkemail/" + inputEmail);
                setUniqueEmail(r.result.unique);
            }
            const timer = setTimeout(() => {
                if (inputEmail) checkEmail();
            }, 500);
            const controller = new AbortController();
            return () => {
                clearTimeout(timer);
                controller.abort();
            };
        }else{
            setUniqueEmail(true);
        }

    }, [inputEmail]);
    useEffect(()=>{
        if((inputFirstName!==name.split(" ")[0] || inputLastName!==name.split(" ")[1] || inputEmail!==email) && inputEmail && inputLastName && inputFirstName && !validateEmail(inputEmail) && !validateName(inputFirstName) && !validateName(inputLastName)){
            setCanSubmit(true);
        }
        else{setCanSubmit(false);}
    },[inputEmail,inputFirstName,inputLastName])
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
        }
        //return false;
        if(checkAt){return false;}
        else{return "Incorrect email format!";}
    }
    function handleClick(){
        if(uniqueEmail){
            setLoading(true);
            const sendPostRequest = async () => {
                try {
                    const results = await FetchWrapper("/users/"+id,
                        "PUT",
                        {"Content-Type": "application/json","Authorization": `Bearer ${sessionStorage.getItem("authorization")}`},
                        {
                            email:inputEmail,firstname:inputFirstName,lastname:inputLastName
                        }
                        );
                    sessionStorage.setItem("authorization", results.result.token);
                    setName(results.result.firstname+" "+results.result.lastname);
                    setEmail(results.result.email);
                    setReadonlyEmail(true);
                    setReadonlyLast(true);
                    setReadonlyFirst(true);
                    setCanSubmit(false);
                    setMessage("Profile updated!");
                    setStatus("success");
                    setTimeout(() => {
                        setMessage("");setStatus("")
                    }, 3000);

                }catch (error){
                    setMessage("Error: "+error.message);
                    setStatus("error");
                    setTimeout(() => {
                        setMessage("");setStatus("");
                    }, 3000);
                }finally{setLoading(false);}
            }
            sendPostRequest();
        }else{
            setMessage("Invalid data!");
            setStatus("error");
            setTimeout(() => {
                setMessage("");setStatus("");
            }, 3000);
        }
    }




    function handleClickDelete(){
        setLoading(true);
        const sendPostRequest = async () => {
            try {
                const results = await FetchWrapper("/users/"+id,
                    "DELETE",
                    {"Content-Type": "application/json","Authorization": `Bearer ${sessionStorage.getItem("authorization")}`}
                );
                sessionStorage.removeItem("authorization");
                setReadonlyEmail(true);
                setReadonlyLast(true);
                setReadonlyFirst(true);
                setMessage("User deleted!");
                setStatus("success");
                setTimeout(() => {
                    setMessage("");setStatus("");nav("/");
                }, 2000);

            }catch (error){
                setMessage("Error: "+error.message);
                setStatus("error");
                setTimeout(() => {
                    setMessage("");setStatus("");
                }, 3000);
            }finally{setLoading(false);}
        }
        sendPostRequest();
    }
    return(
        <>
            <form onSubmit={(e) => e.preventDefault()}>
                <label>First Name:</label>
                <ProfileInput value={inputFirstName} handleChange={(e) => setInputFirstName(e.target.value)}
                              text="First Name" type="text" readonly={readonlyFirst}/>
                {readonlyFirst? <button onClick={() => {
                    setReadonlyFirst(false);
                }} className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 m-4">Edit
                </button> : <button onClick={() => {
                    setReadonlyFirst(true);setInputFirstName(name.split(" ")[0])
                }} className="bg-gray-300 hover:bg-gray-400 text-black font-medium py-2 px-4 rounded-lg transition duration-200 m-4">Cancel
                </button>}
                {validateName(inputFirstName) ? <p className="text-sm text-gray-500 mt-1 h-5 ml-4">
                    {validateName(inputFirstName)}
                </p> :<br/>}
                <br/>
                <br/>
                <br/>
                <label>Last Name:</label>
                <ProfileInput value={inputLastName} handleChange={(e) => setInputLastName(e.target.value)}
                              text="Last Name" type="text" readonly={readonlyLast}/>
                {readonlyLast? <button onClick={() => {
                    setReadonlyLast(false);
                }} className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 m-4">Edit
                </button> : <button onClick={() => {
                    setReadonlyLast(true);setInputLastName(name.split(" ")[1])
                }} className="bg-gray-300 hover:bg-gray-400 text-black font-medium py-2 px-4 rounded-lg transition duration-200 m-4">Cancel
                </button>}
                {validateName(inputLastName) ? <p className="text-sm text-gray-500 mt-1 h-5 ml-4">
                    {validateName(inputLastName)}
                </p> :<br/>}
                <br/>
                <br/>
                <br/>
                <label>Email Address:</label>
                <ProfileInput value={inputEmail} handleChange={(e) => setInputEmail(e.target.value)}
                              text="Email Address" type="text" readonly={readonlyEmail}/>
                {readonlyEmail? <button onClick={() => {
                    setReadonlyEmail(false);
                }} className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 m-4">Edit
                </button> : <button onClick={() => {
                    setReadonlyEmail(true);setInputEmail(email)
                }} className="bg-gray-300 hover:bg-gray-400 text-black font-medium py-2 px-4 rounded-lg transition duration-200 m-4">Cancel
                </button>}
                {validateEmail(inputEmail) ? <p className="text-sm text-gray-500 mt-1 h-5 ml-4">
                    {validateEmail(inputEmail)}
                </p> :<br/>}
                <br/>
                <br/>
                <br/>
                <p>Account creation date: {created_at}</p>
                <br/>
                <br/>
                {canSubmit && <button type="submit" onClick={handleClick} className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 m-4">Submit</button>}
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <button onClick={()=>{
                    const result = window.confirm("Are you sure you want to delete your account?");
                    if (result) {handleClickDelete();}
                }} className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 m-4">DELETE ACCOUNT</button>
            </form>
        </>
    )
}