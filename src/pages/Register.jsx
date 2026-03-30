import '../index.css'
import { useState } from 'react';
import cImage from "../assets/c.png";
import PageLayout from "../components/PageLayout";
import RegisterForm from "../components/RegisterForm";

export default function Register() {
    return(
        <>
            <PageLayout>
            <RegisterForm />
            </PageLayout>
        </>
    )
}