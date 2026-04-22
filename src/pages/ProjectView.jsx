import '../index.css'
import PageLayout from "../components/PageLayout";
import ProjectForm from "../components/ProjectForm.jsx";
import ProjectTasks from "../components/ProjectTasks.jsx";

export default function Register() {
    return(
        <>
            <PageLayout minHeight={"min-h-[2000px]"}>
            <ProjectForm mode={"edit"} />
            <ProjectTasks />
            </PageLayout>
        </>
    )
}