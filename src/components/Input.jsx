import { useRef, useEffect } from 'react';
import '../index.css'

export default function Input({value,text,handleChange}) {
    return (
        <>
            <input value={value} onChange={handleChange} className="border-2 border-gray-400 rounded-md m-4" placeholder={text}/>
        </>
    )
}