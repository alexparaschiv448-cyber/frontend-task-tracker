import { createContext, useContext, useState, useEffect } from "react";

export const context = createContext(null);

export default function Context({ children }) {
    const [state, setState] = useState(()=>{return localStorage.getItem("stare") || "First value";});
    useEffect(() => {
        localStorage.setItem("stare", state);
    }, [state]);
    return (
        <context.Provider value={{ state, setState }}>
            {children}
        </context.Provider>
    );
}