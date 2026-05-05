import {createContext, useContext, useState,useRef} from "react";

export const context = createContext(null);

export default function Context({ children }) {
    const [message, setMessage] = useState("");
    const [status,setStatus] = useState("");
    const [loading,setLoading]=useState(false);
    const [showToast, setShowToast] = useState(false);

    const timeoutRef = useRef(null);


    function SetToast(toastMessage,toastStatus){
        setMessage(toastMessage);
        setStatus(toastStatus);
        setShowToast(true);
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            setShowToast(false);
            setMessage("");
            setStatus("");
        }, 3000);
    }
    return (
        <context.Provider value={{"toast_message":[message,setMessage],"message_status":[status,setStatus],"loading_status":[loading,setLoading],"show_toast":[showToast,setShowToast],"set_toast":SetToast}}>
            {children}
        </context.Provider>
    );
}