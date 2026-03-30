import { useRef, useEffect,useState } from 'react';
import {useParams,Navigate} from "react-router-dom";
import VideoPlayer from './VideoPlayer.jsx';
import { useSearchParams } from "react-router-dom";
export default function ConditionalRoute({children}) {
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    console.log(id);
    if(id!=1){
        return <Navigate to={"/error"} state={{ fromApp: true }} replace></Navigate>;
    }

    return children;

}