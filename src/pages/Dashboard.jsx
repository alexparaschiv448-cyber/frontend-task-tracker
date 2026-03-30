import '../index.css'
import { useState } from 'react';
import cImage from "../assets/c.png";
import {useContext} from "react";
import {context} from "../components/Context.jsx";
import PageHeader from "../components/PageLayout.jsx";
import PageLayout from "../components/PageLayout.jsx";


export default function Dashboard() {
    const {state,setState} = useContext(context);
    console.log(state);
    return(
        <>
            <PageLayout>
                    <button onClick={()=>{setState("test");}}>Set test</button>
                    <h1>State is: {state}</h1>
            </PageLayout>
        </>
    )
}