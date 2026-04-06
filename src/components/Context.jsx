import { createContext,  useState, useEffect } from "react";

export const context = createContext(null);

export default function Context({ children }) {
    const [state, setState] = useState(()=>{return localStorage.getItem("stare") || "First value";});
    const [message, setMessage] = useState("");
    const [status,setStatus] = useState("");
    useEffect(() => {
        localStorage.setItem("stare", state);
    }, [state]);
    return (
        <context.Provider value={{"a":[ state, setState],"b":[message,setMessage],"c":[status,setStatus]}}>
            {children}
        </context.Provider>
    );
}