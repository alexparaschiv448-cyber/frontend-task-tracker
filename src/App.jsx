import './index.css'
import Dashboard from "./pages/Dashboard.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Error from "./pages/Error.jsx";
import Context from "./components/Context.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import AuthCheck from "./components/AuthCheck.jsx";
import Profile from "./pages/Profile.jsx";
import Projects from "./pages/Projects.jsx";
import ProjectCreate from "./pages/ProjectCreate.jsx";
import ProjectView from "./pages/ProjectView.jsx";

export default function App() {
    return (
        <>

        <Context>
            <BrowserRouter>

                <Routes>

                    <Route path="/" element={<AuthCheck><Dashboard/></AuthCheck>}/>
                    <Route path="/register" element={ <AuthCheck><Register/> </AuthCheck>}/>
                    <Route path="/login" element={<AuthCheck><Login/> </AuthCheck>}/>
                    <Route path="/error" element={<AuthCheck><Error /></AuthCheck>} />
                    <Route path="/me" element={<AuthCheck><Profile /></AuthCheck>} />
                    <Route path="/projects" element={<AuthCheck><Projects /></AuthCheck>} />
                    <Route path="/project" element={<AuthCheck><ProjectCreate /></AuthCheck>} />
                    <Route path="/project/:id" element={<AuthCheck><ProjectView /></AuthCheck>} />
                    <Route path="*" element={<AuthCheck><Error /></AuthCheck>} />

                </Routes>

            </BrowserRouter>
        </Context>
        </>
    )
}
