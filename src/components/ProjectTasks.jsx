import '../index.css'
import React, {useContext, useEffect, useState} from "react";
import {context} from "./Context.jsx";
import FetchWrapper from "../assets/FetchWrapper.jsx";
import { useParams } from "react-router-dom";
import {useNavigate} from "react-router-dom";
import {statuses,priorities} from "../assets/ProjectSettings.jsx";
import TasksSearchBar from "./TasksSearchBar.jsx";
import Pages from "./Pages.jsx";
import TaskList from "./TaskList.jsx";

export default function ProjectTasks() {

    let nav=useNavigate();
    const {toast_message,message_status,loading_status}=useContext(context);
    const [loading, setLoading] = loading_status;
    const [message,setMessage]=toast_message;
    const [status,setStatus]=message_status;
    const { id } = useParams();

    const [order, setOrder] = useState("ASC");
    const [taskStatus, setTaskStatus] = useState("Any");
    const [taskPriority, setTaskPriority] = useState("Any");
    const [taskTitle, setTaskTitle] = useState("");
    const [page, setPage] = useState(1);
    const [pageLimit,setPageLimit] = useState(12);
    const [limit, setLimit] = useState(0);
    const [sendSearch,setSendSearch] = useState(false);

    const [tasks,setTasks] = useState([]);



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
    return(
        <>
            <br/>
            <br/>
            <br/>
            <TasksSearchBar onClickButton={()=>{nav("/task",{state:{projectId:id,parentId:null}});}}
                            onClickDue={()=>{
                                if(order === "DESC"){setOrder("ASC")}
                                else{setOrder("DESC")}
                            }} onChangeNumber={(e)=>{
                if(e.currentTarget.value>12 || e.currentTarget.value<1){setPageLimit(1);}
                else{setPageLimit(e.currentTarget.value);}
            }} onChangeStatus={(e)=>{
                if(Object.values(statuses).includes(e.target.value)){setTaskStatus(e.target.value);}
                else{setTaskStatus("Any");}
            }} onChangePriority={(e)=>{
                if(Object.values(priorities).includes(e.target.value)){setTaskPriority(e.target.value);}
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