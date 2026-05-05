import {useLocation, useNavigate} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {statuses,priorities} from "../assets/ProjectSettings.jsx";
import {context} from "./Context.jsx";
import Input from "./Input.jsx";
import Description from "./Description.jsx";
import FetchWrapper from "../assets/FetchWrapper.jsx"


export default function TaskCreateForm() {

    let nav=useNavigate();
    let location=useLocation();
    const {projectId,parentId}=location.state || {};
    const [taskTitle, setTaskTitle] = useState("");
    const [taskDescription, setTaskDescription] = useState("");
    const [taskStatus, setTaskStatus] = useState(statuses.NEW);
    const [taskPriority, setTaskPriority] = useState("4 - Lowest");



    const formatDate = (date) => {
        return date.toISOString().slice(0, 16);
    };
    const [duedate, setDuedate] = useState(formatDate(new Date()));
    const now = formatDate(new Date());

    const {toast_message,message_status,loading_status}=useContext(context);
    const [loading, setLoading] = loading_status;
    const [message,setMessage]=toast_message;
    const [status,setStatus]=message_status;

    const [canSubmit, setCanSubmit] = useState(false);
    const [validDate, setValidDate] = useState(true);

    function validateDatetime(due){
        if(now>due){return "Due date must not be in the past!"}
        else{return false;}
    }


    useEffect(() => {
        const isValid = !validateDatetime(duedate);
        setValidDate(isValid);
    }, [duedate]);



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
        if(validDate && !validateDescription(taskDescription) && !validateTitle(taskTitle) && taskTitle &&!validateDatetime(duedate)){
            setCanSubmit(true);
        }else{
            setCanSubmit(false);
        }
    },[validDate,taskDescription,taskTitle,taskDescription,taskStatus,taskPriority,duedate]);



    function handleClick(){
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




    return (
      <>
          <form onSubmit={(e) => e.preventDefault()}>
              <Input value={taskTitle} text={"Title"} handleChange={(e) => setTaskTitle(e.target.value)}
                     type={"text"}/>
              {validateTitle(taskTitle) ? <p className="text-sm text-gray-500 mt-1 h-5 ml-4">
                  {validateTitle(taskTitle)}
              </p> : <br/>}
              <br/>
              <br/>
              <br/>
              <label className="ml-5">Status:</label>
              <select onChange={(e) =>{
                  if(Object.values(statuses).includes(e.target.value)){setTaskStatus(e.target.value);}
                  else{setTaskStatus(statuses.NEW);}
              }}>
                  <option value={statuses.NEW}>New</option>
                  <option value={statuses.IN_PROGRESS}>In Progress</option>
                  <option value={statuses.DONE}>Done</option>
              </select>
              <br/>
              <br/>
              <br/>
              <br/>
              <label className="ml-5">Priority:</label>
              <select onChange={(e) =>{
                  if(Object.values(priorities).includes(e.target.value)){setTaskPriority(e.target.value);}
                  else{setTaskPriority(priorities[4]);}
              }}>
                  <option value={priorities[0]}>0 - Highest</option>
                  <option value={priorities[1]}>1 - High</option>
                  <option value={priorities[2]}>2 - Medium</option>
                  <option value={priorities[3]}>3 - Low</option>
                  <option value={priorities[4]} selected={true}>4 - Lowest</option>
              </select>
              <br/>
              <br/>
              <br/>
              <br/>
              <Description handleChange={(e) => setTaskDescription(e.target.value)} />
              {validateDescription(taskDescription) ? <p className="text-sm text-gray-500 mt-1 h-5 ml-4">
                  {validateDescription(taskDescription)}
              </p> : <br/>}
              <br/>
              <br/>
              <br/>
              <br/>
              <label className="ml-4">Due Date:</label>
              <input  type={"datetime-local"} value={duedate || ""} onChange={(e) => {setDuedate(e.target.value);}}/>
              {validateDatetime(duedate) ?  <p className="text-sm text-gray-500 mt-1 h-5 ml-4">
                  {validateDatetime(duedate)}
              </p> : <br/>}
              <br/>
              <br/>
              <br/>
              <br/>
              {canSubmit && <button type="submit" onClick={handleClick} className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 m-4">Submit</button>}
          </form>
      </>
    );
}