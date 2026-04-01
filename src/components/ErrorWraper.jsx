import {useParams,Navigate,useLocation} from "react-router-dom";
export default function ErrorWrapper({children}) {
    const location = useLocation();
    //if(!location.state?.fromApp){
    //    console.log("Locatie: "+location.state)
    //    return <Navigate to={"/"} replace></Navigate>;
    //}
    return children;

}