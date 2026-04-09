import '../index.css'
import PageLayout from "../components/PageLayout";
import ProjectsSearchBar from "../components/ProjectsSearchBar";
import {useNavigate} from "react-router-dom";
import {useState, useEffect, useContext} from "react";
import Input from "./Input";
import Description from "./Description";
import FetchWrapper from "../assets/FetchWrapper.jsx";
import {context} from "./Context.jsx";
import {statuses} from "../assets/ProjectSettings.jsx";

export default function Projects() {
    let nav=useNavigate();
    const [projectName, setProjectName] = useState("");
    const [projectDescription, setProjectDescription] = useState("");
    const [projectStatus, setProjectStatus] = useState(statuses.NEW);
    const {toast_message,message_status,loading_status}=useContext(context);
    const [loading, setLoading] = loading_status;
    const [message,setMessage]=toast_message;
    const [status,setStatus]=message_status;
    function validateName(name){
        if(name.length>50){
            return "Name too long!";
        }
        return false;
    }
    function validateDescription(description){
        if(description.length>1000){
            return "Description too long!";
        }
        return false;
    }
    function handleClick(){
        if(projectName && projectStatus && !validateName(projectName) && !validateDescription(projectDescription)){
            setLoading(true);
            async function createProject(){
                try {
                    if(projectDescription){
                        const results = await FetchWrapper("/projects",
                            "POST",
                            {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${sessionStorage.getItem("authorization")}`
                            },
                            {
                                name: projectName, description: projectDescription, status: projectStatus,
                            })
                    }else{
                        const results = await FetchWrapper("/projects",
                            "POST",
                            {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${sessionStorage.getItem("authorization")}`
                            },
                            {
                                name: projectName, status: projectStatus,
                            })
                    }
                    setMessage("Project created!");
                    setStatus("success");
                    setTimeout(() => {
                        setMessage("");setStatus("")
                        nav("/projects");
                    }, 2000);
                }catch(error){
                    setMessage("Error: "+error.message);
                    setStatus("error");
                    setTimeout(() => {
                        setMessage("");setStatus("");
                    }, 3000);
                }finally {
                    setLoading(false);
                }
            }
            createProject();
        }else{
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
            <Input value={projectName} text={"Project Name"} handleChange={(e) => setProjectName(e.target.value)}
                   type={"text"}/>
            {validateName(projectName) ? <p className="text-sm text-gray-500 mt-1 h-5 ml-4">
                {validateName(projectName)}
            </p> : <br/>}
            <br/>
            <br/>
            <br/>
            <label className="ml-5">Status:</label>
            <select onChange={(e) =>{
                if(Object.values(statuses).includes(e.target.value)){setProjectStatus(e.target.value);}
                else{setProjectStatus(statuses.NEW);}
            }}>
                <option value={statuses.NEW}>New</option>
                <option value={statuses.IN_PROGRESS}>In Progress</option>
                <option value={statuses.DONE}>Done</option>
            </select>
            <br/>
            <br/>
            <br/>
            <br/>
            <Description handleChange={(e) => setProjectDescription(e.target.value)} />
                {validateDescription(projectDescription) ? <p className="text-sm text-gray-500 mt-1 h-5 ml-4">
                    {validateDescription(projectDescription)}
                </p> : <br/>}
            <br/>
            <br/>
                <button type="submit" onClick={handleClick} className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 m-4">Create</button>

            </form>
        </>
    )
}