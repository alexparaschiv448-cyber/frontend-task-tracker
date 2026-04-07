import {createContext, useContext, useState} from "react";

export const context = createContext(null);

export default function Context({ children }) {
    const [message, setMessage] = useState("");
    const [status,setStatus] = useState("");
    const [loading,setLoading]=useState(false);
    return (
        <context.Provider value={{"toast_message":[message,setMessage],"message_status":[status,setStatus],"loading_status":[loading,setLoading]}}>
            {children}
        </context.Provider>
    );
}