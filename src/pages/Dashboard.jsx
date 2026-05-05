import '../index.css'
import {useContext, useEffect} from "react";
import {context} from "../components/Context.jsx";
import PageLayout from "../components/PageLayout.jsx";
import {useLocation, useNavigate} from "react-router-dom";
import FetchWrapper from "../assets/FetchWrapper.jsx";
import ProjectsChart from "../components/ProjectsChart.jsx";
import PriorityChart from "../components/PriorityChart";
import UserSummary from "../components/UserSummary.jsx";
import {useQueries, useQueryClient} from '@tanstack/react-query';


export default function Dashboard() {
    const queryClient = useQueryClient();
    const {toast_message,message_status,loading_status,show_toast,set_toast}=useContext(context);
    const [loading, setLoading] = loading_status;
    let errorMessage="";
    const location = useLocation();
    let nav=useNavigate();
    useEffect(() => {
        const state = location.state;

        if (state?.toastMessage && state?.toastStatus) {
            set_toast(state.toastMessage, state.toastStatus);
            window.history.replaceState({}, '');
        }

    }, []);



    let data=[];
        const results = useQueries({
            networkMode: 'always',
            retry:false,
            queries:sessionStorage.getItem("authorization") ? [{
                queryKey: ['summary'],
                queryFn: async () => {
                    const results = await FetchWrapper("/dashboard/summary",
                        "GET",
                        {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${sessionStorage.getItem("authorization")}`
                        },
                        {}, "")
                    return results.result;
                },retry:false,staleTime:5*60*1000

            },{
                queryKey: ['statuses'],
                queryFn: async () => {
                    const results = await FetchWrapper("/dashboard/statuses",
                        "GET",
                        {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${sessionStorage.getItem("authorization")}`
                        },
                        {}, "")
                    return results.result;
                },retry:false,staleTime:5*60*1000
            },{
                queryKey: ['priorities'],
                queryFn: async () => {
                    const results = await FetchWrapper("/dashboard/priorities",
                        "GET",
                        {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${sessionStorage.getItem("authorization")}`
                        },
                        {}, "")
                    return results.result;
                },retry:false,staleTime:5*60*1000
            }] : []
        })
        const pending = results.length>0 ? results[2].isPending : false;
        if(pending){setLoading(true);console.log("on")}else {
            //console.log("Pending: ",isPending);
            //data=results;
            //console.log(data[0].data);
            console.log("off");
            const error = results?.filter(item => item?.data?.code !== "RETURNED" && item?.data?.code !== "NOT_FOUND");
            data=results.length>0 ? results : null;
            setLoading(false);
            if (error?.length > 0) {
                errorMessage=error[0]?.data?.message;
            }
        }


    useEffect(() => {
        console.log("Loading: ",loading);
    }, [loading]);

        useEffect(() => {
            if(errorMessage){
                setLoading(false);
                queryClient.clear();
                sessionStorage.clear();
                nav("/login", {
                    state: {
                        toastMessage: errorMessage,
                        toastStatus: "error"
                    },
                    replace: true
                });
            }
        },[errorMessage])


    return(
        <>
            <PageLayout minHeight={"min-h-[1200px]"}  >

            <UserSummary data1={data ? data[0]?.data?.data : null} />
                <div className="w-[100%] flex flex-row wrap gap-12 justify-between">
            <ProjectsChart data2={data ? data[1]?.data?.data : null} />
            <PriorityChart data3={data ? data[2]?.data?.data : null} />
            </div>
            </PageLayout>
        </>
    )
}