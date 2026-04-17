import '../index.css'
import PageLayout from "../components/PageLayout";
import TaskEditForm from "../components/TaskEditForm";

export default function Register() {
    return(
        <>
            <PageLayout minHeight={"min-h-[1500px]"}>
                <TaskEditForm />
            </PageLayout>
        </>
    )
}