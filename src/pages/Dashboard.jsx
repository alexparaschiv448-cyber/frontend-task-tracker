import '../index.css'
import {useContext} from "react";
import {context} from "../components/Context.jsx";
import PageLayout from "../components/PageLayout.jsx";
import {useNavigate} from "react-router-dom";
import {user_context} from "../components/AuthCheck.jsx";
import FetchWrapper from "../assets/FetchWrapper.jsx";
import ProjectsChart from "../components/ProjectsChart.jsx";
import PriorityChart from "../components/PriorityChart";
import UserSummary from "../components/UserSummary.jsx";


export default function Dashboard() {

    return(
        <>
            <PageLayout minHeight={"min-h-[1200px]"}  >
            <UserSummary />
            <ProjectsChart />
            <PriorityChart />
            </PageLayout>
        </>
    )
}