import NavBar from "./NavBar.jsx";
import {useState, createContext, useContext} from "react";
import Loading from "./Loading.jsx";
import {context} from "./Context.jsx";
export default function PageLayout({children}) {
    const {loading_status}= useContext(context);
    const [loading,setLoading]=loading_status;

    return(
        <>
            <NavBar/>
            <Loading visible={loading} />
            <div className="min-h-screen flex justify-center items-start">

                <div className="w-[90%] h-screen bg-white p-6 relative">
                    {children}
                </div>

            </div>
        </>
    )
}