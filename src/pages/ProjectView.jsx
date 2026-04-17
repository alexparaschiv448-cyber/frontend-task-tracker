import '../index.css'
import PageLayout from "../components/PageLayout";
import ProjectEditForm from "../components/ProjectEditForm";

export default function Register() {
    return(
        <>
            <PageLayout minHeight={"min-h-[2000px]"}>
            <ProjectEditForm />
            </PageLayout>
        </>
    )
}