import '../index.css'
import PageLayout from "../components/PageLayout";
import TaskForm from "../components/TaskForm";

export default function Register() {
    return(
        <>
            <PageLayout minHeight={"min-h-[1500px]"}>
            <TaskForm mode={"edit"} />
            </PageLayout>
        </>
    )
}