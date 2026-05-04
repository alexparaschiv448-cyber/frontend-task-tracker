import {useState, useEffect, useContext} from "react";
import {context} from "./Context.jsx";
import {useLocation} from "react-router-dom";


export default function Toast() {

    let location=useLocation();
    const {toast_message,message_status,loading_status,show_toast}=useContext(context);
    const [message,setMessage]=toast_message;
    const [status,setStatus]=message_status;
    const [showToast,setShowToast]=show_toast;

    function closeToast() {
        setShowToast(false);
    }

    if(!showToast) return null;


    if(status==="success") {
        return (
            <div id="toast-success"
                 className="flex items-center w-full max-w-sm p-4 text-body bg-neutral-primary-soft rounded-base shadow-xs border border-default fixed bottom-10 right-10"
                 role="alert">
                <div
                    className="inline-flex items-center justify-center shrink-0 w-7 h-7 text-fg-success bg-success-soft rounded">
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24"
                         height="24"
                         fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M5 11.917 9.724 16.5 19 7.5"/>
                    </svg>
                    <span className="sr-only">Check icon</span>
                </div>
                <div className="ms-3 text-sm font-normal">{message}</div>
                <button type="button"
                        className="ms-auto flex items-center justify-center text-body hover:text-heading bg-transparent box-border border border-transparent hover:bg-neutral-secondary-medium focus:ring-4 focus:ring-neutral-tertiary font-medium leading-5 rounded text-sm h-8 w-8 focus:outline-none"
                        data-dismiss-target="#toast-success" aria-label="Close" onClick={closeToast}>
                    <span className="sr-only">Close</span>
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24"
                         height="24"
                         fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M6 18 17.94 6M18 18 6.06 6"/>
                    </svg>
                </button>
            </div>
        );
    } else if(status==="error"){
        return (
            <div id="toast-danger"
                 className="flex items-center w-full max-w-sm p-4 text-body bg-neutral-primary-soft rounded-base shadow-xs border border-default fixed bottom-10 right-10"
                 role="alert">
                <div
                    className="inline-flex items-center justify-center shrink-0 w-7 h-7 text-fg-danger bg-danger-soft rounded">
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24"
                         height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M6 18 17.94 6M18 18 6.06 6"/>
                    </svg>
                    <span className="sr-only">Error icon</span>
                </div>
                <div className="ms-3 text-sm font-normal">{message}</div>
                <button type="button"
                        className="ms-auto flex items-center justify-center text-body hover:text-heading bg-transparent box-border border border-transparent hover:bg-neutral-secondary-medium focus:ring-4 focus:ring-neutral-tertiary font-medium leading-5 rounded text-sm h-8 w-8 focus:outline-none"
                        data-dismiss-target="#toast-danger" aria-label="Close" onClick={closeToast}>
                    <span className="sr-only">Close</span>
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24"
                         height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M6 18 17.94 6M18 18 6.06 6"/>
                    </svg>
                </button>
            </div>
        )
    }
};
