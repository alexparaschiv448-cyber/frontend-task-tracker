import '../index.css'
import PageLayout from "../components/PageLayout";
import TaskForm from "../components/TaskForm.jsx";

export default function TaskCreate() {
    return(
        <>
            <PageLayout>
            <TaskForm mode={"create"} />
            </PageLayout>
        </>
    )
}