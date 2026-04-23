import '../index.css'
import React, {useContext, useEffect, useState} from "react";
import {context} from "./Context.jsx";
import FetchWrapper from "../assets/FetchWrapper.jsx";
import { useParams } from "react-router-dom";
import {useNavigate} from "react-router-dom";
import Input from "./Input.jsx";
import {statuses} from "../assets/ProjectSettings.jsx";
import Description from "./Description.jsx";

export default function ProjectForm({mode}) {

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
    


    useEffect(()=>{
        if(mode==="create"){
            setReadOnlyName(false);
            setReadOnlyDescription(false);
            setReadOnlyStatus(false);
            setProjectStatus(statuses.NEW);
        }
    },[])


    function validateName(name){
        if(name.length>50){
            return "Name too long!";
        }
        return false;
    }




    function validateDescription(description){
        if(mode==="edit") {
            if (description && description.length > 1000) {
                return "Description too long!";
            }
            return false;
        }else if(mode==="create"){
            if(description.length>1000){
                return "Description too long!";
            }
            return false;
        }
    }

    useEffect(()=>{
        if(mode==='edit') {
            if ((projectName !== initialName || projectDescription !== initialDescription || projectStatus !== initialStatus) && projectName && projectStatus && !validateName(projectName) && !validateDescription(projectDescription)) {
                setCanSubmit(true);
            } else {
                setCanSubmit(false);
            }
        }
    },[projectStatus,projectName,projectDescription])



    useEffect(()=>{
        if(mode==="edit") {
            setLoading(true);
            async function fetchProjectData() {
                try {
                    const results = await FetchWrapper("/projects/" + id,
                        "GET",
                        {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${sessionStorage.getItem("authorization")}`
                        });
                    if (results.status === 401 && results.result.code === "UNAUTHORIZED") {
                        sessionStorage.clear();
                        nav("/login");
                    } else if (results.status === 404 && results.result.code === "NOT_FOUND") {
                        nav("/error");
                    } else if (results.status === 200 && results.result.code === "PROJECT_FOUND") {
                        setProjectDescription(results.result.data.description);
                        setInitialDescription(results.result.data.description);
                        setProjectName(results.result.data.name);
                        setInitialName(results.result.data.name);
                        setProjectStatus(results.result.data.status);
                        setInitialStatus(results.result.data.status);
                        setProjectCreationDate(results.result.data.createdat);
                    } else if(results.status===403 && results.result.code==="FORBIDDEN"){
                        sessionStorage.clear();
                        nav("/login");
                    }

                } catch (error) {
                    setMessage("Error: " + error.message);
                    setStatus("error");
                    setTimeout(() => {
                        setMessage("");
                        setStatus("");
                    }, 3000);
                } finally {
                    setLoading(false);
                }
            }

            fetchProjectData();
        }
    },[])




    function handleClick(){
        if(mode==="edit") {
            setLoading(true);
            let body;
            if (projectDescription) {
                body = {name: projectName, description: projectDescription, status: projectStatus}
            } else {
                body = {name: projectName, status: projectStatus}
            }
            const sendUpdateRequest = async () => {
                try {
                    const results = await FetchWrapper("/projects/" + id,
                        "PUT",
                        {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${sessionStorage.getItem("authorization")}`
                        },
                        body
                    );
                    if (results.status === 401 && results.result.code === "UNAUTHORIZED") {
                        sessionStorage.clear();
                        nav("/login");
                    } else if (results.status === 403 && results.result.code==="FORBIDDEN") {
                        sessionStorage.clear();
                        nav("/login");
                    } else if (results.status === 200 && results.result.code==="PROJECT_UPDATED") {
                        setInitialDescription(projectDescription);
                        setInitialStatus(projectStatus);
                        setInitialName(projectName);
                        setReadOnlyName(true);
                        setReadOnlyDescription(true);
                        setReadOnlyStatus(true);
                        setCanSubmit(false);
                        setMessage(results.result.message);
                        setStatus("success");
                        setTimeout(() => {
                            setMessage("");
                            setStatus("");
                        }, 3000);
                    }

                } catch (error) {
                    setMessage("Error: " + error.message);
                    setStatus("error");
                    setTimeout(() => {
                        setMessage("");
                        setStatus("");
                    }, 3000);
                } finally {
                    setLoading(false);
                }
            }
            sendUpdateRequest();
        }else if(mode==="create"){
            if(projectName && projectStatus && !validateName(projectName) && !validateDescription(projectDescription)){
                setLoading(true);
                async function createProject(){
                    try {
                        let body;
                        if(projectDescription){
                            body= {
                                    name: projectName, description: projectDescription, status: projectStatus,
                                };
                        }else{
                            body={
                                    name: projectName, status: projectStatus,
                                };
                        }
                        const results = await FetchWrapper("/projects",
                            "POST",
                            {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${sessionStorage.getItem("authorization")}`
                            },body)
                        if(results.status===200 && results.result.code==="PROJECT_CREATED") {
                            setMessage(results.result.message);
                            setStatus("success");
                            setTimeout(() => {
                                setMessage("");
                                setStatus("")
                                nav("/projects");
                            }, 2000);
                        } else if(results.status===401 && results.result.code==="UNAUTHORIZED") {
                            setMessage(results.result.message);
                            setStatus("error");
                            setTimeout(() => {
                                setMessage("");
                                setStatus("")
                            }, 3000);
                        }
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
    }



    function handleClickDelete(){
        if(mode==="edit") {
            setLoading(true);
            const sendPostRequest = async () => {
                try {
                    const results = await FetchWrapper("/projects/" + id,
                        "DELETE",
                        {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${sessionStorage.getItem("authorization")}`
                        }
                    );
                    if (results.status === 200 && results.result.code==="PROJECT_DELETED") {
                        setReadOnlyStatus(true);
                        setReadOnlyName(true);
                        setReadOnlyDescription(true);
                        setCanSubmit(false);
                        setMessage(results.result.message);
                        setStatus("success");
                        setTimeout(() => {
                            setMessage("");
                            setStatus("");
                            nav("/projects");
                        }, 2000);
                    } else if (results.status === 403 && results.result.code==="FORBIDDEN") {
                        sessionStorage.clear();
                        nav("/login");
                    } else if (results.status === 401 && results.result.code==="UNAUTHORIZED") {
                        sessionStorage.clear();
                        nav("/login");
                    }
                } catch (error) {
                    setMessage("Error: " + error.message);
                    setStatus("error");
                    setTimeout(() => {
                        setMessage("");
                        setStatus("");
                    }, 3000);
                } finally {
                    setLoading(false);
                }
            }
            sendPostRequest();
        }
    }


    return(
        <>
            <form onSubmit={(e) => e.preventDefault()}>
                <Input value={projectName} text={"Project Name"} handleChange={(e) => setProjectName(e.target.value)}
                       type={"text"} readonly={readOnlyName} />
                {mode==='edit' && readOnlyName? <button onClick={() => {
                    setReadOnlyName(false);
                }} className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 m-4">Edit
                </button> : mode==='edit' && <button onClick={() => {
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
                {mode==='edit' && readOnlyStatus? <button onClick={() => {
                    setReadOnlyStatus(false);
                }} className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 m-4">Edit
                </button> : mode==='edit' && <button onClick={() => {
                    setReadOnlyStatus(true);setProjectStatus(initialStatus);
                }} className="bg-gray-300 hover:bg-gray-400 text-black font-medium py-2 px-4 rounded-lg transition duration-200 m-4">Cancel
                </button>}
                <br/>
                <br/>
                <br/>
                <br/>
                <Description value={projectDescription} readonly={readOnlyDescription} handleChange={(e) => setProjectDescription(e.target.value)} />
                <br/>
                {mode==='edit' && readOnlyDescription? <button onClick={() => {
                    setReadOnlyDescription(false);
                }} className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 m-4">Edit
                </button> : mode==='edit' && <button onClick={() => {
                    setReadOnlyDescription(true);setProjectDescription(initialDescription);
                }} className="bg-gray-300 hover:bg-gray-400 text-black font-medium py-2 px-4 rounded-lg transition duration-200 m-4">Cancel
                </button>}
                {validateDescription(projectDescription) ? <p className="text-sm text-gray-500 mt-1 h-5 ml-4">
                    {validateDescription(projectDescription)}
                </p> : <br/>}
                <br/>
                <br/>
                { mode==='edit' && <div className="ml-5 text-xs text-gray-500">
                    Creation date: {new Date(projectCreationDate).toLocaleString()}
                </div> }
                <br/>
                <br/>
                { mode==='edit' && canSubmit ? <button type="submit" onClick={handleClick} className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 m-4">Submit</button>
                : mode==='create'  && <button type="submit" onClick={handleClick} className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 m-4">Create</button>}
                <br/>
                <br/>
                <br/>
                {mode==='edit' && <button onClick={()=>{
                    const result = window.confirm("Are you sure you want to delete this project? All of its tasks will be deleted!");
                    if (result) {handleClickDelete();}
                }} className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 m-4">DELETE PROJECT</button> }
            </form>
        </>
    )
}