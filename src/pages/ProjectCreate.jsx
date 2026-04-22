import '../index.css'
import PageLayout from "../components/PageLayout";
import ProjectForm from "../components/ProjectForm.jsx";

export default function Projects() {
    return(
        <>
            <PageLayout>
            <ProjectForm mode={"create"} />
            </PageLayout>
        </>
    )
}