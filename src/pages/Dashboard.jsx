import '../index.css'
import {useContext, useEffect} from "react";
import {context} from "../components/Context.jsx";
import PageLayout from "../components/PageLayout.jsx";
import {useLocation, useNavigate} from "react-router-dom";
import {user_context} from "../components/AuthCheck.jsx";
import FetchWrapper from "../assets/FetchWrapper.jsx";
import ProjectsChart from "../components/ProjectsChart.jsx";
import PriorityChart from "../components/PriorityChart";
import UserSummary from "../components/UserSummary.jsx";


export default function Dashboard() {
    const {toast_message,message_status,loading_status,show_toast,set_toast}=useContext(context);
    const location = useLocation();
    useEffect(() => {
        const state = location.state;

        if (state?.toastMessage && state?.toastStatus) {
            set_toast(state.toastMessage, state.toastStatus);
            window.history.replaceState({}, '');
        }

    }, []);

    return(
        <>
            <PageLayout minHeight={"min-h-[1200px]"}  >

            <UserSummary />
                <div className="w-[100%] flex flex-row wrap gap-12 justify-between">
            <ProjectsChart />
            <PriorityChart />
            </div>
            </PageLayout>
        </>
    )
}