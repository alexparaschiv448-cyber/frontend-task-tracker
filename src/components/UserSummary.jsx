import 'flowbite';
import Chart from "react-apexcharts";
import {useContext, useEffect, useState} from "react";
import FetchWrapper from "../assets/FetchWrapper.jsx";
import {context} from "./Context.jsx";
import {useNavigate} from "react-router-dom";
import {Card} from "flowbite-react";
import {status_code} from "../assets/ProjectSettings.jsx";

export default function UserSummary({data1}){
    let nav=useNavigate();
    const [projectCount, setProjectCount] = useState(0);
    const [taskCount, setTaskCount] = useState(0);

    if(data1 && !taskCount && !projectCount){
        setProjectCount(data1.project_count);
        setTaskCount(data1.task_count);
    }


    return(
        <>
        <div className="rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800 mb-4 h-[150px] grid grid-rows-2 grid-cols-[200px_1fr] gap-2 grid-flow-col items-center">
            <div className={"ml-4"}>Projects Created: {projectCount ? projectCount : 0}</div>
            <div className={"ml-4"}>Tasks Created: {taskCount ? taskCount : 0}</div>
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