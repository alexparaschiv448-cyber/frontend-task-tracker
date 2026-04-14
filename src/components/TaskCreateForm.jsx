import {useNavigate} from "react-router-dom";
import {useContext, useState} from "react";
import {statuses} from "../assets/ProjectSettings.jsx";
import {context} from "./Context.jsx";
import Input from "./Input.jsx";
import Description from "./Description.jsx";


export default function TaskCreateForm() {
    let nav=useNavigate();
    const now = new Date();
    const [taskTitle, setTaskTitle] = useState("");
    const [taskDescription, setTaskDescription] = useState("");
    const [taskStatus, setTaskStatus] = useState(statuses.NEW);
    const [projectId, setProjectId] = useState(0);
    const [parentId, setParentId] = useState(0);
    const [taskPriority, setTaskPriority] = useState("");
    const [duedate, setDuedate] = useState(now.toISOString());


    const {toast_message,message_status,loading_status}=useContext(context);
    const [loading, setLoading] = loading_status;
    const [message,setMessage]=toast_message;
    const [status,setStatus]=message_status;



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
              <Description handleChange={(e) => setTaskDescription(e.target.value)} />
              {validateDescription(taskDescription) ? <p className="text-sm text-gray-500 mt-1 h-5 ml-4">
                  {validateDescription(taskDescription)}
              </p> : <br/>}
              <br/>
              <br/>
          </form>
      </>
    );
}