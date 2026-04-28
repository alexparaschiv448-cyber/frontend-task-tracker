import {useLocation, useNavigate} from "react-router-dom";
import {useContext, useEffect} from "react";
import {context} from "../../components/Context.jsx";
import Toast from "../../components/Toast.jsx";

export default function MockDashboard() {
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
            <Toast />
            <button onClick={()=>{nav("/login")}}>Login</button>
            <div>MOCKDASHBOARD</div>
        </>
    );
}