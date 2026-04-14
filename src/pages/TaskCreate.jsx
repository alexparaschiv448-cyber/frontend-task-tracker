import '../index.css'
import PageLayout from "../components/PageLayout";
import TaskCreateForm from "../components/TaskCreateForm.jsx";

export default function TaskCreate() {
    return(
        <>
            <PageLayout>
            <TaskCreateForm />
            </PageLayout>
        </>
    )
}