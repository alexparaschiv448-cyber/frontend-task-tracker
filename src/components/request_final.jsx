import { useRef, useEffect, useState } from 'react';

export default function Lista(){
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(
                    "http://localhost:8000/conn"
                );

                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }

                const json = await response.json();
                setData(Object.values(json.message));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []); // runs once on mount

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    const a1=data.map(x=><li key={x.id}>{x.name}</li>);
    return <ul>{a1}</ul>;

}

