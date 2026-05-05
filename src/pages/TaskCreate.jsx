import '../index.css'
import PageLayout from "../components/PageLayout";
import TaskForm from "../components/TaskForm.jsx";
import {useContext, useEffect} from "react";
import {context} from "../components/Context.jsx";
import {useLocation} from "react-router-dom";

export default function TaskCreate() {
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
            <PageLayout>
            <TaskForm mode={"create"} />
            </PageLayout>
        </>
    )
}