import '../index.css'
import { useState } from 'react';
import cImage from "../assets/c.png";
import PageLayout from "../components/PageLayout";
import LoginForm from "../components/LoginForm";


export default function Login() {
    return(
        <>
            <PageLayout>
            <LoginForm />
            </PageLayout>
        </>
    )
}