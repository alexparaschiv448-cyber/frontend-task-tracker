import {useLocation, useNavigate} from "react-router-dom";
import {useContext, useEffect} from "react";
import {context} from "../../components/Context.jsx";
import PageLayout from "../../components/PageLayout.jsx";

export default function MockProjectsList() {
    let nav=useNavigate();
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
                <button onClick={()=>{nav("/project/152")}}>Go</button>
            </PageLayout>
        </>
    );
}