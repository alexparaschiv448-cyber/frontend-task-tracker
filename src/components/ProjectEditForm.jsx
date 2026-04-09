import '../index.css'
import {useContext, useEffect, useState} from "react";
import {context} from "./Context.jsx";
import FetchWrapper from "../assets/FetchWrapper.jsx";
import { useParams } from "react-router-dom";
import {useNavigate} from "react-router-dom";
import Input from "./Input.jsx";
import {statuses} from "../assets/ProjectSettings.jsx";
import Description from "./Description.jsx";

export default function ProjectEditForm() {
    let nav=useNavigate();
    const {toast_message,message_status,loading_status}=useContext(context);
    const [loading, setLoading] = loading_status;
    const [message,setMessage]=toast_message;
    const [status,setStatus]=message_status;
    const { id } = useParams();

    const [projectName,setProjectName]=useState("");
    const [projectStatus,setProjectStatus]=useState("");
    const [projectDescription,setProjectDescription]=useState("");
    const [projectCreationDate,setProjectCreationDate]=useState("");

    const [readOnlyName,setReadOnlyName]=useState(true);
    const [readOnlyDescription,setReadOnlyDescription]=useState(true);
    const [readOnlyStatus,setReadOnlyStatus]=useState(true);

    const[initialName,setInitialName]=useState("");
    const[initialDescription,setInitialDescription]=useState("");
    const[initialStatus,setInitialStatus]=useState("");

    const [canSubmit,setCanSubmit]=useState(false);




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




    useEffect(()=>{
        if((projectName!==initialName || projectDescription!==initialDescription || projectStatus!==initialStatus) && projectName && projectStatus && !validateName(projectName) && !validateDescription(projectDescription)){
            setCanSubmit(true);
        }
        else{setCanSubmit(false);}
    },[projectStatus,projectName,projectDescription])




    useEffect(()=>{
        setLoading(true);
        async function fetchProjectData(){
            try{
                const results = await FetchWrapper("/projects/"+id,
                    "GET",
                    {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${sessionStorage.getItem("authorization")}`
                    });
                if(results.status===401){

                    sessionStorage.clear();
                    nav("/login");
                }else if(results.status===404){
                    nav("/error");
                }else if(results.status===200){
                    if(results.result.description!=="None"){
                        setProjectDescription(results.result.description);
                        setInitialDescription(results.result.description);
                    }
                    setProjectName(results.result.name);
                    setInitialName(results.result.name);
                    setProjectStatus(results.result.status);
                    setInitialStatus(results.result.status);
                    setProjectCreationDate(results.result.createdat);
                }

            }catch(error){
                setMessage("Error: "+error.message);
                setStatus("error");
                setTimeout(() => {
                    setMessage("");setStatus("");
                }, 3000);
            }finally{
                setLoading(false);
            }
        }
        fetchProjectData();
    },[])





    function handleClick(){
        setLoading(true);
        let body;
        if(projectDescription){
            body={name:projectName,description:projectDescription,status:projectStatus}
        }else{
            body={name:projectName,status:projectStatus}
        }
        const sendUpdateRequest = async () => {
            try {
                const results = await FetchWrapper("/projects/"+id,
                    "PUT",
                    {"Content-Type": "application/json","Authorization": `Bearer ${sessionStorage.getItem("authorization")}`},
                    body
                );
                if(results.status===401) {

                    sessionStorage.clear();
                    nav("/login");
                }else if(results.status===200){
                    setInitialDescription(projectDescription);
                    setInitialStatus(projectStatus);
                    setInitialName(projectName);
                    setReadOnlyName(true);
                    setReadOnlyDescription(true);
                    setReadOnlyStatus(true);
                    setCanSubmit(false);
                    setMessage("Project updated!");
                    setStatus("success");
                    setTimeout(() => {
                        setMessage("");setStatus("");
                    }, 3000);
                }

            }catch (error){
                setMessage("Error: "+error.message);
                setStatus("error");
                setTimeout(() => {
                    setMessage("");setStatus("");
                }, 3000);
            }finally{setLoading(false);}
        }
        sendUpdateRequest();
    }




    function handleClickDelete(){
        setLoading(true);
        const sendPostRequest = async () => {
            try {
                const results = await FetchWrapper("/projects/"+id,
                    "DELETE",
                    {"Content-Type": "application/json","Authorization": `Bearer ${sessionStorage.getItem("authorization")}`}
                );
                setReadOnlyStatus(true);
                setReadOnlyName(true);
                setReadOnlyDescription(true);
                setCanSubmit(false);
                setMessage("project deleted!");
                setStatus("success");
                setTimeout(() => {
                    setMessage("");setStatus("");nav("/projects");
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
                <Input value={projectName} text={"Project Name"} handleChange={(e) => setProjectName(e.target.value)}
                       type={"text"} readonly={readOnlyName} />
                {readOnlyName? <button onClick={() => {
                    setReadOnlyName(false);
                }} className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 m-4">Edit
                </button> : <button onClick={() => {
                    setReadOnlyName(true);setProjectName(initialName);
                }} className="bg-gray-300 hover:bg-gray-400 text-black font-medium py-2 px-4 rounded-lg transition duration-200 m-4">Cancel
                </button>}
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
                }}disabled={readOnlyStatus} >
                    <option value={statuses.NEW} selected={projectStatus===statuses.NEW}>New</option>
                    <option value={statuses.IN_PROGRESS} selected={projectStatus===statuses.IN_PROGRESS}>In Progress</option>
                    <option value={statuses.DONE} selected={projectStatus===statuses.DONE}>Done</option>
                </select>
                {readOnlyStatus? <button onClick={() => {
                    setReadOnlyStatus(false);
                }} className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 m-4">Edit
                </button> : <button onClick={() => {
                    setReadOnlyStatus(true);setProjectStatus(initialStatus);
                }} className="bg-gray-300 hover:bg-gray-400 text-black font-medium py-2 px-4 rounded-lg transition duration-200 m-4">Cancel
                </button>}
                <br/>
                <br/>
                <br/>
                <br/>
                <Description value={projectDescription} readonly={readOnlyDescription} handleChange={(e) => setProjectDescription(e.target.value)} />
                <br/>
                {readOnlyDescription? <button onClick={() => {
                    setReadOnlyDescription(false);
                }} className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 m-4">Edit
                </button> : <button onClick={() => {
                    setReadOnlyDescription(true);setProjectDescription(initialDescription);
                }} className="bg-gray-300 hover:bg-gray-400 text-black font-medium py-2 px-4 rounded-lg transition duration-200 m-4">Cancel
                </button>}
                {validateDescription(projectDescription) ? <p className="text-sm text-gray-500 mt-1 h-5 ml-4">
                    {validateDescription(projectDescription)}
                </p> : <br/>}
                <br/>
                <br/>
                <p>Creation date: {projectCreationDate}</p>
                <br/>
                <br/>
                {canSubmit && <button type="submit" onClick={handleClick} className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 m-4">Submit</button>}
                <br/>
                <br/>
                <button onClick={()=>{
                    const result = window.confirm("Are you sure you want to delete this project?");
                    if (result) {handleClickDelete();}
                }} className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 m-4">DELETE PROJECT</button>
            </form>
        </>
    )
}