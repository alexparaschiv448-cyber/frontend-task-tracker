import {useNavigate} from "react-router-dom";

export default function NavButton({text,clickHandler}) {
    if(sessionStorage.getItem("authorization") && (text==="Register" || text==="Login")){
        return(<></>);

    }
    if(!sessionStorage.getItem("authorization") && (text==="Logout" ||  text==="Profile")){
        return(<></>);
    }
    return(
        <>
            <button className="text-blue-100 hover:text-white hover:bg-blue-800 px-4 py-2 rounded-md transition duration-200" onClick={clickHandler}>
                {text}
            </button>
        </>
    )
}