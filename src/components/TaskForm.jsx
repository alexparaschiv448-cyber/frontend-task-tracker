import React, {useContext, useEffect, useState,useRef} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {context} from "./Context.jsx";
import Input from "./Input.jsx";
import {priorities, statuses} from "../assets/ProjectSettings.jsx";
import Description from "./Description.jsx";
import FetchWrapper from "../assets/FetchWrapper.jsx";


export default function TaskForm({mode}) {

    const formatDate = (date) => {
        return date.toISOString().slice(0, 16);
    };
    const now = formatDate(new Date());
    const [duedate, setDuedate] = useState(formatDate(new Date()));

    let nav=useNavigate();
    let location=useLocation();
    const {projectid}=location.state || {};
    const {toast_message,message_status,loading_status}=useContext(context);
    const [loading, setLoading] = loading_status;
    const [message,setMessage]=toast_message;
    const [status,setStatus]=message_status;
    const { id } = useParams();

    const ref = useRef(null);

    const [taskTitle,setTaskTitle]=useState("");
    const [taskStatus,setTaskStatus]=useState("");
    const [taskPriority,setTaskPriority]=useState("");
    const [taskDescription,setTaskDescription]=useState("");
    const [taskDueDate,setTaskDueDate]=useState("");
    const [taskParentName,setTaskParentName]=useState("");
    const [trueParentName,setTrueParentName]=useState("");
    const [taskParentId, setTaskParentId]=useState(null);


    const [readOnlyTitle,setReadOnlyTitle]=useState(true);
    const [readOnlyDescription,setReadOnlyDescription]=useState(true);
    const [readOnlyStatus,setReadOnlyStatus]=useState(true);
    const [readOnlyPriority,setReadOnlyPriority]=useState(true);
    const [readOnlyDueDate,setReadOnlyDueDate]=useState(true);
    const [readOnlyParentName,setReadOnlyParentName]=useState(true);


    const[initialTitle,setInitialTitle]=useState("");
    const[initialDescription,setInitialDescription]=useState("");
    const[initialStatus,setInitialStatus]=useState("");
    const[initialPriority,setInitialPriority]=useState("");
    const[initialDueDate,setInitialDueDate]=useState("");
    const[initialParentName,setInitialParentName]=useState("");
    const[initialParentId,setInitialParentId]=useState(null);
    const[searchResult,setSearchResult]=useState([]);

    const [canSubmit,setCanSubmit]=useState(false);

    const [showDropdown, setShowDropdown] = useState(false);
    const [validDate, setValidDate] = useState(true);

    const {projectId,parentId}=location.state || {};

    useEffect(() => {
        if(mode==='create') {
            const isValid = !validateDatetime(duedate);
            setValidDate(isValid);
        }
    }, [duedate]);



    useEffect(() => {
        if(mode==='create'){
            setReadOnlyDueDate(false);
            setReadOnlyStatus(false);
            setReadOnlyPriority(false);
            setReadOnlyTitle(false);
            setReadOnlyDescription(false);
            setReadOnlyParentName(false);
            setTaskStatus(statuses.NEW);
            setTaskPriority(priorities["4"]);
        }
    }, []);




    function validateDatetime(due){
        if(mode==='edit') {
            if (due === initialDueDate) {
                return false;
            }
            if (now > due) {
                return "Due date must not be in the past!"
            } else {
                return false;
            }
        }else if(mode==='create'){
            if(now>due){return "Due date must not be in the past!"}
            else{return false;}
        }
    }



    function validateTitle(title){
        if(title.length>50){
            return "Title too long!";
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
        if(mode==='edit') {
            if ((taskTitle !== initialTitle || taskDescription !== initialDescription || taskStatus !== initialStatus || taskPriority !== initialPriority || taskDueDate !== initialDueDate || taskParentId !== initialParentId) && taskTitle && !validateTitle(taskTitle) && !validateDescription(taskDescription) && !validateDatetime(taskDueDate) && (taskParentName === trueParentName || taskParentId === null)) {
                setCanSubmit(true);
            } else {
                setCanSubmit(false);
            }
        }
    },[taskTitle,taskStatus,taskPriority,taskDescription,taskDueDate,taskParentId,taskParentName])


    useEffect(()=>{
        if(mode==='create') {
            if (validDate && !validateDescription(taskDescription) && !validateTitle(taskTitle) && taskTitle && !validateDatetime(duedate)) {
                setCanSubmit(true);
            } else {
                setCanSubmit(false);
            }
        }
    },[validDate,taskDescription,taskTitle,taskDescription,taskStatus,taskPriority,duedate]);


    useEffect(()=>{
        if(mode==='edit') {
            setLoading(true);

            async function fetchTaskData() {
                try {
                    const results = await FetchWrapper("/tasks/" + id,
                        "GET",
                        {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${sessionStorage.getItem("authorization")}`
                        });
                    if (results.status === 401) {
                        sessionStorage.clear();
                        nav("/login");
                    } else if (results.status === 200) {
                        if (results.result.description) {
                            setTaskDescription(results.result.description);
                            setInitialDescription(results.result.description);
                        }
                        setTaskTitle(results.result.title);
                        setInitialTitle(results.result.title);

                        setTaskStatus(results.result.status);
                        setInitialStatus(results.result.status);

                        setTaskDueDate(results.result.duedate);
                        setInitialDueDate(results.result.duedate);

                        setTaskPriority(results.result.priority);
                        setInitialPriority(results.result.priority);

                        setTaskParentName(results.result.parentname);
                        setInitialParentName(results.result.parentname);
                        setTrueParentName(results.result.parentname);

                        setTaskParentId(results.result.parentid);
                        setInitialParentId(results.result.parentid);
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

            fetchTaskData();
        }
    },[])


    useEffect(() => {
        if(mode==='edit') {
            async function checkParent() {
                setShowDropdown(true);
                const results = await FetchWrapper("/search/parent/" + id,
                    "GET",
                    {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${sessionStorage.getItem("authorization")}`
                    }, {},
                    "?projectid=" + projectid + "&title=" + taskParentName);
                if (results.status === 200) {
                    setSearchResult(results.result);
                    setShowDropdown(true);
                } else {
                    setSearchResult([]);
                }

            }

            const timer = setTimeout(() => {
                if (taskParentName && taskParentName !== initialParentName) checkParent();
                else if (taskParentName === "") {
                    setTaskParentId(null)
                }
            }, 500);
            const controller = new AbortController();
            return () => {
                clearTimeout(timer);
                controller.abort();
            };
        }
    }, [taskParentName]);

    const handleSelect = (value) => {

        setTaskParentName(value.title);
        setTrueParentName(value.title);
        setTaskParentId(value.id);
        setShowDropdown(false);
        ref.current.blur();
    };

    function handleClick(){
        if(mode==='edit') {
            setLoading(true);
            let body = {
                title: taskTitle,
                status: taskStatus,
                priority: taskPriority,
                dueDate: taskDueDate,
                projectId: projectid
            };
            if (taskDescription) {
                body = {...body, description: taskDescription};
            }
            if (taskParentName) {
                body = {...body, parentId: taskParentId};
            }
            if (taskParentId === null) {
                body = {...body, parentId: null};
            }
            const sendUpdateRequest = async () => {
                try {
                    const results = await FetchWrapper("/tasks/" + id,
                        "PUT",
                        {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${sessionStorage.getItem("authorization")}`
                        },
                        body
                    );
                    if (results.status === 401) {
                        sessionStorage.clear();
                        nav("/login");
                    } else if (results.status === 422 && results.result.message === "Circular parent relation!") {
                        throw new Error("Circular relation detected! Choose another parent!");
                    } else if (results.status === 200) {
                        setInitialDescription(taskDescription);
                        setInitialStatus(taskStatus);
                        setInitialTitle(taskTitle);
                        setInitialStatus(taskPriority);
                        setInitialDueDate(taskDueDate);
                        setInitialParentName(taskParentName);
                        setTrueParentName("");
                        setInitialParentId(taskParentId);
                        setReadOnlyTitle(true);
                        setReadOnlyDescription(true);
                        setReadOnlyStatus(true);
                        setReadOnlyPriority(true);
                        setReadOnlyParentName(true);
                        setReadOnlyDueDate(true);
                        setCanSubmit(false);
                        setShowDropdown(false);
                        setMessage("Task updated!");
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
        }else if(mode==='create'){
            setLoading(true);
            //const date = new Date(duedate).toISOString();
            async function createTask(){
                try {
                    let body={title: taskTitle, status: taskStatus, priority: taskPriority,projectId: projectId,dueDate:duedate}
                    if(taskDescription){body={...body,description:taskDescription}}
                    if(parentId){body={...body,parentId:parentId}}
                    const results = await FetchWrapper("/tasks",
                        "POST",
                        {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${sessionStorage.getItem("authorization")}`
                        },body);
                    setMessage("Task created!");
                    setStatus("success");
                    setCanSubmit(false);
                    setTimeout(() => {
                        setMessage("");setStatus("");
                        nav(`/project/${projectId}`);
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
            createTask();
        }
    }


    useEffect(() => {
        if(mode==='edit') {
            const handleClickOutside = (e) => {
                if (ref.current && !ref.current.contains(e.target)) {
                    setShowDropdown(false);
                }
            };

            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }
    }, []);


    function handleClickDelete(){
        if(mode==='edit') {
            setLoading(true);
            const sendDeleteRequest = async () => {
                try {
                    const results = await FetchWrapper("/tasks/" + id,
                        "DELETE",
                        {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${sessionStorage.getItem("authorization")}`
                        }, {},
                        "?projectid=" + projectid
                    );
                    setReadOnlyTitle(true);
                    setReadOnlyDescription(true);
                    setReadOnlyStatus(true);
                    setReadOnlyPriority(true);
                    setReadOnlyParentName(true);
                    setReadOnlyDueDate(true);
                    setCanSubmit(false);
                    setShowDropdown(false);
                    setMessage("task deleted!");
                    setStatus("success");
                    setTimeout(() => {
                        setMessage("");
                        setStatus("");
                        nav(`/project/${projectid}`);
                    }, 2000);

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
            sendDeleteRequest();
        }
    }

    useEffect(() => {
        console.log(taskStatus);
    },[taskStatus]);


    return(
        <>
            <form onSubmit={(e) => e.preventDefault()}>
                <Input value={taskTitle} text={"Task Title"} handleChange={(e) => setTaskTitle(e.target.value)}
                       type={"text"} readonly={readOnlyTitle} />
                {mode==='edit' && readOnlyTitle? <button onClick={() => {
                    setReadOnlyTitle(false);
                }} className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 m-4">Edit
                </button> : mode==='edit' && <button onClick={() => {
                    setReadOnlyTitle(true);setTaskTitle(initialTitle);
                }} className="bg-gray-300 hover:bg-gray-400 text-black font-medium py-2 px-4 rounded-lg transition duration-200 m-4">Cancel
                </button>}
                {validateTitle(taskTitle) ? <p className="text-sm text-gray-500 mt-1 h-5 ml-4">
                    {validateTitle(taskTitle)}
                </p> : <br/>}
                <br/>
                <br/>
                <br/>
                <label className="ml-5">Status:</label>
                {mode==='edit' ? <select onChange={(e) =>{
                    if(Object.values(statuses).includes(e.target.value)){setTaskStatus(e.target.value);}
                    else{setTaskStatus(statuses.NEW);}
                }}disabled={readOnlyStatus} >

                    <option value={statuses.NEW} selected={taskStatus===statuses.NEW}>New</option>
                    <option value={statuses.IN_PROGRESS} selected={taskStatus===statuses.IN_PROGRESS}>In Progress</option>
                    <option value={statuses.DONE} selected={taskStatus===statuses.DONE}>Done</option>
                </select> :
                    <select onChange={(e) =>{
                        if(Object.values(statuses).includes(e.target.value)){setTaskStatus(e.target.value);}
                        else{setTaskStatus(statuses.NEW);}
                    }}>
                        <option value={statuses.NEW}>New</option>
                        <option value={statuses.IN_PROGRESS}>In Progress</option>
                        <option value={statuses.DONE}>Done</option>
                    </select>}
                {mode==='edit' && readOnlyStatus? <button onClick={() => {
                    setReadOnlyStatus(false);
                }} className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 m-4">Edit
                </button> : mode==='edit' && <button onClick={() => {
                    setReadOnlyStatus(true);setTaskStatus(initialStatus);
                }} className="bg-gray-300 hover:bg-gray-400 text-black font-medium py-2 px-4 rounded-lg transition duration-200 m-4">Cancel
                </button>}
                <br/>
                <br/>
                <br/>
                <br/>
                <label className="ml-5">Priority:</label>
                {mode==='edit' ? <select onChange={(e) =>{
                    if(Object.values(priorities).includes(e.target.value)){setTaskPriority(e.target.value);}
                    else{setTaskPriority(priorities[4]);}
                }} disabled={readOnlyPriority} >
                    <option value={priorities[0]} selected={taskPriority===priorities[0]}>0 - Highest</option>
                    <option value={priorities[1]} selected={taskPriority===priorities[1]}>1 - High</option>
                    <option value={priorities[2]} selected={taskPriority===priorities[2]}>2 - Medium</option>
                    <option value={priorities[3]} selected={taskPriority===priorities[3]}>3 - Low</option>
                    <option value={priorities[4]} selected={taskPriority===priorities[4]}>4 - Lowest</option>
                </select> :
                    <select onChange={(e) =>{
                        if(Object.values(priorities).includes(e.target.value)){setTaskPriority(e.target.value);}
                        else{setTaskPriority(priorities[4]);}
                    }}>
                        <option value={priorities[0]}>0 - Highest</option>
                        <option value={priorities[1]}>1 - High</option>
                        <option value={priorities[2]}>2 - Medium</option>
                        <option value={priorities[3]}>3 - Low</option>
                        <option value={priorities[4]} selected={true}>4 - Lowest</option>
                    </select>}
                {mode==='edit' && readOnlyPriority? <button onClick={() => {
                    setReadOnlyPriority(false);
                }} className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 m-4">Edit
                </button> : mode==='edit' && <button onClick={() => {
                    setReadOnlyPriority(true);setTaskPriority(initialPriority);setShowDropdown(false);
                }} className="bg-gray-300 hover:bg-gray-400 text-black font-medium py-2 px-4 rounded-lg transition duration-200 m-4">Cancel
                </button>}
                <br/>
                <br/>
                <br/>
                <br/>
                <Description value={taskDescription} readonly={readOnlyDescription} handleChange={(e) => setTaskDescription(e.target.value)} />
                <br/>
                { mode==='edit' && readOnlyDescription? <button onClick={() => {
                    setReadOnlyDescription(false);
                }} className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 m-4">Edit
                </button> : mode==='edit' && <button onClick={() => {
                    setReadOnlyDescription(true);setTaskDescription(initialDescription);
                }} className="bg-gray-300 hover:bg-gray-400 text-black font-medium py-2 px-4 rounded-lg transition duration-200 m-4">Cancel
                </button>}
                {validateDescription(taskDescription) ? <p className="text-sm text-gray-500 mt-1 h-5 ml-4">
                    {validateDescription(taskDescription)}
                </p> : <br/>}
                <br/>
                <br/>
                <br/>
                <br/>
                <label className="ml-4">Due Date:</label>
                { mode==='edit' ? <input readOnly={readOnlyDueDate} type={"datetime-local"} value={taskDueDate || ""} onChange={(e) => {setTaskDueDate(e.target.value);}}/> :
                    <input  type={"datetime-local"} value={duedate || ""} onChange={(e) => {setDuedate(e.target.value);}}/>}
                { mode==='edit' && readOnlyDueDate? <button onClick={() => {
                    setReadOnlyDueDate(false);
                }} className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 m-4">Edit
                </button> : mode==='edit' && <button onClick={() => {
                    setReadOnlyDueDate(true);setTaskDueDate(initialDueDate);
                }} className="bg-gray-300 hover:bg-gray-400 text-black font-medium py-2 px-4 rounded-lg transition duration-200 m-4">Cancel
                </button>}
                {mode==='edit' && validateDatetime(taskDueDate) ?  <p className="text-sm text-gray-500 mt-1 h-5 ml-4">
                    {validateDatetime(taskDueDate)}
                </p> : mode==='edit' && <br/>}
                {mode==='create' && validateDatetime(duedate) ?  <p className="text-sm text-gray-500 mt-1 h-5 ml-4">
                    {validateDatetime(duedate)}
                </p> : mode==='create' && <br/>}
                <br/>
                <br/>
                <div style={{ position: "relative",width: "300px"}} ref={ref} >
                    { mode==='edit' && <input value={taskParentName ? taskParentName : ""} placeholder={"Parent Name"} onChange={(e) => setTaskParentName(e.target.value)}
                           type={"text"} readOnly={readOnlyParentName} className="border-2 border-gray-400 rounded-md m-4" onFocus={() => searchResult.length && setShowDropdown(true)} />}
                    {mode==='edit' && readOnlyParentName? <button onClick={() => {
                        setReadOnlyParentName(false);
                    }} className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 ml-0 mb-4 absolute bottom-0">Edit
                    </button> : mode==='edit' && <button onClick={() => {
                        setReadOnlyParentName(true);setTaskParentName(initialParentName);setSearchResult([]);setTaskParentId(initialParentId);setShowDropdown(false);setTrueParentName(initialParentName);
                    }} className="bg-gray-300 hover:bg-gray-400 text-black font-medium py-2 px-4 rounded-lg transition duration-200 ml-0 mb-4 absolute bottom-0">Cancel
                    </button>}
                    {mode==='edit' && !readOnlyParentName && showDropdown && searchResult.length>0 && (
                        <ul  style={{
                            position: "absolute",
                            top: "100%",
                            left: 13,
                            right: 0,
                            border: "1px solid #ccc",
                            background: "#fff",
                            listStyle: "none",
                            margin: 0,
                            padding: 0
                        }}>
                            {searchResult.map((item, index) => (
                                <li
                                    key={index}
                                    onClick={() => handleSelect(item)}
                                    style={{ padding: "8px", cursor: "pointer" }}
                                >
                                    {item.title}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                { mode==='edit' && canSubmit ? <button type="submit" onClick={handleClick} className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 m-4">Submit</button>
                : mode==='create' && canSubmit && <button type="submit" onClick={handleClick} className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 m-4">Submit</button>}
                <br/>
                <br/>
                { mode==='edit' && <button onClick={()=>{
                    const result = window.confirm("Are you sure you want to delete this task?");
                    if (result) {handleClickDelete();}
                }} className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 m-4">DELETE TASK</button> }
            </form>
        </>
    )
}