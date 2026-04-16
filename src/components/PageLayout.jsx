import NavBar from "./NavBar.jsx";
import {useContext} from "react";
import Loading from "./Loading.jsx";
import {context} from "./Context.jsx";
export default function PageLayout({minHeight="min-h-screen",children}) {
    const {loading_status}= useContext(context);
    const [loading,setLoading]=loading_status;
    const height=minHeight.split("-")[1]+"-"+minHeight.split("-")[2];
    console.log(height);
    return(
        <>
            <NavBar/>
            <Loading visible={loading} />
            <div className={minHeight+" flex justify-center items-start"}>

                <div className={height+" w-[90%] min-h-screen bg-white p-6 relative"}>
                    {children}
                </div>

            </div>
        </>
    )
}