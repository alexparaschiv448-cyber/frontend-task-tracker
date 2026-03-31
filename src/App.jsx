import './index.css'
import Page from "./pages/page.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ConditionalRoute from "./components/ConditionalRoute.jsx";
import Error from "./pages/Error.jsx";
import ErrorWrapper from "./components/ErrorWraper.jsx";
import {useState, createContext, useContext,Provider} from 'react';
import Context from "./components/Context.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";

export default function App() {
    return (
        <>
        <Context>
            <BrowserRouter>

                <Routes>
                    <Route path="/" element={<Dashboard/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/error" element={<ErrorWrapper><Error /></ErrorWrapper>} />
                    <Route path="/test" element={<ConditionalRoute><Page/></ConditionalRoute>} />
                    <Route path="*" element={<ErrorWrapper><Error /></ErrorWrapper>} />
                </Routes>

            </BrowserRouter>
        </Context>
        </>
    )
}
