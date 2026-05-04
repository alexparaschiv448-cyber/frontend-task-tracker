import '../index.css'
import PageLayout from "../components/PageLayout";
import ProjectsSearchBar from "../components/ProjectsSearchBar";
import {useLocation, useNavigate} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import FetchWrapper from "../assets/FetchWrapper.jsx"
import {context} from "../components/Context.jsx";
import Pages from "../components/Pages.jsx"
import ProjectList from "../components/ProjectList.jsx"
import {status_code} from "../assets/ProjectSettings.jsx";


export default function Projects() {
    let nav=useNavigate();
    const statuses = ["Any","New","In Progress","Done"];
    const [order, setOrder] = useState("DESC");
    const [projectStatus, setProjectStatus] = useState("Any");
    const [projectName, setProjectName] = useState("");
    const [page, setPage] = useState(1);
    const [pageLimit,setPageLimit] = useState(10);
    const [limit, setLimit] = useState(0);
    const [sendSearch,setSendSearch] = useState(false);
    //const [load, setLoad] = useState(true);

    const [projects,setProjects] = useState([]);


    const {toast_message,message_status,loading_status,show_toast,set_toast}=useContext(context);
    const [loading, setLoading] = loading_status;
    const [message,setMessage]=toast_message;
    const [status,setStatus]=message_status;

    const location = useLocation();
    useEffect(() => {
        const state = location.state;

        if (state?.toastMessage && state?.toastStatus) {
            set_toast(state.toastMessage, state.toastStatus);
            window.history.replaceState({}, '');
        }
    }, []);


    useEffect(() => {
        let query=`?order=${order}&limit=${pageLimit}&offset=${(page-1)*pageLimit}`;
        if(projectName){query+=`&name=${projectName}`;}
        if(projectStatus!=="Any"){query+=`&status=${projectStatus}`;}
        setLoading(true);
        async function fetchData(){
            try {
                const results = await FetchWrapper("/projects",
                    "GET",
                    {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${sessionStorage.getItem("authorization")}`
                    },
                    {}, query)
                if(results.status===200 && results.result.code===status_code["200"][1]) {
                    setLimit(results.result.data[0].limit);
                    setProjects(results.result.data);
                    if (page > Math.ceil(results.result.data[0].limit / pageLimit)) {
                        setPage(Math.ceil(results.result.data[0].limit / pageLimit));
                    }
                } else if(results.status===401 && results.result.code===status_code["401"]){
                    sessionStorage.clear();
                    nav("/login", {
                        state: {
                            toastMessage: results.result.message,
                            toastStatus: "error"
                        },
                        replace: true
                    });
                } else {
                    setLimit(0);
                    setProjects([]);
                    setPage(1);
                }

                setLoading(false);
            }catch(error){
                set_toast(error.message,"error");
            }finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [page,sendSearch]);



    return(
        <>
            <PageLayout>
            <ProjectsSearchBar onClickButton={()=>{nav("/project");}}
                               onClickOrder={()=>{
                                   if(order === "DESC"){setOrder("ASC")}
                                   else{setOrder("DESC")}
                               }} onChangeNumber={(e)=>{
                                   if(e.currentTarget.value>10 || e.currentTarget.value<1){setPageLimit(1);}
                                   else{setPageLimit(e.currentTarget.value);}
                               }} onChangeStatus={(e)=>{
                                    if(statuses.includes(e.target.value)){setProjectStatus(e.target.value);}
                                    else{setProjectStatus("Any");}
                                }} onChangeName={(e)=>{
                                    setProjectName(e.target.value);
                                }} order={order==="DESC"? true : false}
                                   pageLimit={pageLimit}
                                onClickSearch={()=>{
                                    setPage(1);
                                    setSendSearch(!sendSearch);
                                }} />
                <div className="w-full mt-8 text-center">
                {projects.length===0 ? <span className="text-gray-400 text-4xl font-semibold">
                    No projects
                </span> : <ProjectList projects={projects} /> }

                    <Pages page={page}  limit={limit} pageLimit={pageLimit} onPageChange={(e)=>{setPage(Number(e.target.dataset.id))}} />
                </div>
            </PageLayout>
        </>
    )
}