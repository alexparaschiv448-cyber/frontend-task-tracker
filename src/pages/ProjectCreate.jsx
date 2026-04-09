import '../index.css'
import PageLayout from "../components/PageLayout";
import {useNavigate} from "react-router-dom";
import CreateProjectForm from "../components/CreateProjectForm";

export default function Projects() {
    let nav=useNavigate();
    return(
        <>
            <PageLayout>
            <CreateProjectForm />
            </PageLayout>
        </>
    )
}