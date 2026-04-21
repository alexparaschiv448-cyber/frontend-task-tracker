import 'flowbite';
import Chart from "react-apexcharts";
import {useContext, useEffect, useState} from "react";
import FetchWrapper from "../assets/FetchWrapper.jsx";
import {context} from "./Context.jsx";
import {useNavigate} from "react-router-dom";
import {Card} from "flowbite-react";


export default function UserSummary(){
    let nav=useNavigate();
    const [projectCount, setProjectCount] = useState(0);
    const [taskCount, setTaskCount] = useState(0);

    const {toast_message,message_status,loading_status}=useContext(context);
    const [loading, setLoading] = loading_status;
    const [message,setMessage]=toast_message;
    const [status,setStatus]=message_status;



    useEffect(() => {
        if(sessionStorage.getItem('authorization')) {
            setLoading(true);
            async function fetchUserData() {
                try {
                    const results = await FetchWrapper("/dashboard/summary",
                        "GET",
                        {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${sessionStorage.getItem("authorization")}`
                        });
                    if (results.status === 401) {
                        sessionStorage.clear();
                        nav("/login");
                    } else if (results.status === 404) {
                        nav("/error");
                    } else if (results.status === 200) {
                        setProjectCount(results.result.project_count);
                        setTaskCount(results.result.task_count);
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

            fetchUserData();
        }
    },[])

    return(
        <>
        <Card className="mb-4 h-[150px] relative">
            <div className={"absolute top-8 left-10"}>Projects Created: {projectCount}</div>
            <br/>
            <br/>
            <br/>
            <br/>
            <div className={"absolute bottom-8 left-10"}>Tasks Created: {taskCount}</div>
            <button
                className="text-blue-100 hover:text-white hover:bg-blue-800 px-4 py-2 rounded-md transition duration-200 bg-blue-600 absolute top-6 left-60"
                onClick={()=>{nav("/project");}}
            >
                Create Project
            </button>
        </Card>
        </>
    )
}