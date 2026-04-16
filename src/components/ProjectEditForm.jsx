import '../index.css'
import React, {useContext, useEffect, useState} from "react";
import {context} from "./Context.jsx";
import FetchWrapper from "../assets/FetchWrapper.jsx";
import { useParams } from "react-router-dom";
import {useNavigate} from "react-router-dom";
import Input from "./Input.jsx";
import {statuses} from "../assets/ProjectSettings.jsx";
import Description from "./Description.jsx";
import TasksSearchBar from "./TasksSearchBar.jsx";
import ProjectList from "./ProjectList.jsx";
import Pages from "./Pages.jsx";
import TaskList from "./TaskList.jsx";


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



    const statuses = ["Any","New","In Progress","Done"];
    const priorities = ["Any","0 - Highest","1 - High","2 - Medium","3 - Low","4 - Lowest"];
    const [order, setOrder] = useState("ASC");
    const [taskStatus, setTaskStatus] = useState("Any");
    const [taskPriority, setTaskPriority] = useState("Any");
    const [taskTitle, setTaskTitle] = useState("");
    const [page, setPage] = useState(1);
    const [pageLimit,setPageLimit] = useState(12);
    const [limit, setLimit] = useState(0);
    const [sendSearch,setSendSearch] = useState(false);
    //const [load, setLoad] = useState(true);

    const [tasks,setTasks] = useState([]);




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


    useEffect(() => {
        let query=`?order=${order}&limit=${pageLimit}&offset=${(page-1)*pageLimit}&projectId=${id}`;
        if(taskTitle){query+=`&title=${taskTitle}`;}
        if(taskStatus!=="Any"){query+=`&status=${taskStatus}`;}
        if(taskPriority!=="Any"){query+=`&priority=${taskPriority}`;}
        setLoading(true);
        async function fetchData(){
            try {
                const results = await FetchWrapper("/tasks",
                    "GET",
                    {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${sessionStorage.getItem("authorization")}`
                    },
                    {}, query)
                if (results.result.length > 0) {
                    setLimit(results.result[0].limit);
                    setTasks(results.result);
                    if (page > Math.ceil(results.result[0].limit / pageLimit)) {
                        setPage(Math.ceil(results.result[0].limit / pageLimit));
                    }
                } else {
                    setLimit(0);
                    setTasks([]);
                    setPage(1);
                }

                setLoading(false);
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
        fetchData();
    }, [page,sendSearch]);

    useEffect(() => {
        console.log(tasks);
    },[tasks]);


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
                <div className="ml-5 text-xs text-gray-500">
                    Creation date: {new Date(projectCreationDate).toLocaleString()}
                </div>
                <br/>
                <br/>
                {canSubmit && <button type="submit" onClick={handleClick} className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 m-4">Submit</button>}
                <br/>
                <br/>
                <br/>
                <button onClick={()=>{
                    const result = window.confirm("Are you sure you want to delete this project?");
                    if (result) {handleClickDelete();}
                }} className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 m-4">DELETE PROJECT</button>
            </form>
            <br/>
            <br/>
            <br/>
            <TasksSearchBar onClickButton={()=>{nav("/task",{state:{projectId:id}});}}
                            onClickDue={()=>{
                                if(order === "DESC"){setOrder("ASC")}
                                else{setOrder("DESC")}
                            }} onChangeNumber={(e)=>{
                                if(e.currentTarget.value>12 || e.currentTarget.value<1){setPageLimit(1);}
                                else{setPageLimit(e.currentTarget.value);}
                            }} onChangeStatus={(e)=>{
                                if(statuses.includes(e.target.value)){setTaskStatus(e.target.value);}
                                else{setTaskStatus("Any");}
                            }} onChangePriority={(e)=>{
                                if(priorities.includes(e.target.value)){setTaskPriority(e.target.value);}
                                else{setTaskPriority("Any");}
                            }} onChangeTitle={(e)=>{
                                setTaskTitle(e.target.value);
                            }} order={order==="DESC"? true : false}
                            pageLimit={pageLimit}
                            onClickSearch={()=>{
                                setPage(1);
                                setSendSearch(!sendSearch);
                            }} />
            <div className="w-full mt-8 text-center">
                {tasks.length===0 ? <span className="text-gray-400 text-4xl font-semibold">
                    No tasks
                </span> : <TaskList tasks={tasks} /> }

                <Pages page={page}  limit={limit} pageLimit={pageLimit} onPageChange={(e)=>{setPage(Number(e.target.dataset.id))}} />
            </div>
        </>
    )
}