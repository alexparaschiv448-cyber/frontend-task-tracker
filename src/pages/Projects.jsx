import '../index.css'
import PageLayout from "../components/PageLayout";
import ProjectsSearchBar from "../components/ProjectsSearchBar";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import FetchWrapper from "../assets/FetchWrapper.jsx"

export default function Projects() {
    let nav=useNavigate();
    const statuses = ["Any","New","In Progress","Done"];
    const [order, setOrder] = useState("DESC");
    const [status, setStatus] = useState("Any");
    const [projectName, setProjectName] = useState("");
    const [page, setPage] = useState(1);
    const [pageLimit,setPageLimit] = useState(10);
    const [limit, setLimit] = useState(0);
    const [load, setLoad] = useState(true);
    useEffect(() => {
        let query=`?order=${order}&limit=${pageLimit}&offset=${page-1}`;
        if(projectName){query+=`&name=${projectName}`;}
        if(status!=="Any"){query+=`&status=${status}`;}
        console.log(status);
        async function fetchData(){
            const result=await FetchWrapper("http://localhost:8000/projects",
                "GET",
                {"Content-Type": "application/json","Authorization": `Bearer ${sessionStorage.getItem("authorization")}`},
                {}, query)
            console.log(result)
            setLoad(false)
        }
        fetchData();
    }, [order,status,page,pageLimit,projectName]);
    //useEffect(()=>{
    //    console.log(order,status,projectName,pageLimit);
    //},[order,status,projectName,pageLimit]);


    return(
        <>
            <PageLayout>
            <ProjectsSearchBar onClickButton={()=>{nav("/project");}}
                               onClickOrder={()=>{
                                   if(order === "DESC"){setOrder("ASC")}
                                   else{setOrder("DESC")}
                               }} onChangeNumber={(e)=>{
                                   if(e.currentTarget.value>10 || e.currentTarget.value<1){setPageLimit(1)}
                                   else{setPageLimit(e.currentTarget.value)}
                               }} onChangeStatus={(e)=>{
                                    if(statuses.includes(e.target.value)){setStatus(e.target.value);}
                                    else{setStatus("Any");}
                                }} onChangeName={(e)=>{
                                    setProjectName(e.target.value);
                                }} order={order==="DESC"? true : false}
                                   pageLimit={pageLimit}     />
                <br/>
                <br/>
                <br/>
                <br/>
                <div className="w-full mt-8 text-center">
                    {load && <p>Loading...</p>}
                <span className="text-gray-400 text-4xl font-semibold">
                    No projects
                </span>
                    <div className="absolute bottom-4 right-4 flex gap-2">
                        <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition">
                            1
                        </button>
                        <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition">
                            2
                        </button>
                        <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition">
                            3
                        </button>
                    </div>
                </div>
            </PageLayout>
        </>
    )
}