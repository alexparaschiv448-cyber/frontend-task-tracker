import 'flowbite';
import Chart from "react-apexcharts";
import {useContext, useEffect, useState} from "react";
import FetchWrapper from "../assets/FetchWrapper.jsx";
import {context} from "./Context.jsx";
import {useNavigate} from "react-router-dom";
import {Card} from "flowbite-react";
import {status_code} from "../assets/ProjectSettings.jsx";

export default function UserSummary(){
    let nav=useNavigate();
    const [projectCount, setProjectCount] = useState(0);
    const [taskCount, setTaskCount] = useState(0);

    const {toast_message,message_status,loading_status,show_toast,set_toast}=useContext(context);
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
                    if (results.status === 401 && results.result.code===status_code["401"]) {
                        sessionStorage.clear();
                        nav("/login", {
                            state: {
                                toastMessage: results.result.message,
                                toastStatus: "error"
                            },
                            replace: true
                        });
                    } else if (results.status === 200 && results.result.code===status_code["200"][1]) {
                        setProjectCount(results.result.data.project_count);
                        setTaskCount(results.result.data.task_count);
                    }
                } catch (error) {
                    set_toast(error.message,"error");
                } finally {
                    setLoading(false);
                }
            }

            fetchUserData();
        }
    },[])

    return(
        <>
        <div className="rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800 mb-4 h-[150px] grid grid-rows-2 grid-cols-[200px_1fr] gap-2 grid-flow-col items-center">
            <div className={"ml-4"}>Projects Created: {projectCount}</div>
            <div className={"ml-4"}>Tasks Created: {taskCount}</div>
            { sessionStorage.getItem("authorization") && <button
                className="text-blue-100 hover:text-white hover:bg-blue-800 px-4 py-2 rounded-md transition duration-200 bg-blue-600 w-[150px]"
                onClick={()=>{nav("/project");}}
            >
                Create Project
            </button> }
            { sessionStorage.getItem("authorization") && <button
                className="text-blue-100 hover:text-white hover:bg-blue-800 px-4 py-2 rounded-md transition duration-200 bg-blue-600 w-[150px]"
                onClick={()=>{sessionStorage.setItem("authorization","ddd");}}
            >
                Incorrect Auth
            </button> }
        </div>
        </>
    )
}