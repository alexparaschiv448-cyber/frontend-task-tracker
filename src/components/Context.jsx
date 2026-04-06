import { createContext,  useState } from "react";

export const context = createContext(null);

export default function Context({ children }) {
    const [message, setMessage] = useState("");
    const [status,setStatus] = useState("");
    return (
        <context.Provider value={{"toast_message":[message,setMessage],"message_status":[status,setStatus]}}>
            {children}
        </context.Provider>
    );
}