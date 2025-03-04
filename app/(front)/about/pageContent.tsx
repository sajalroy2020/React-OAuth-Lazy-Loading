"use client";

import React, { useState } from 'react'
import Link from 'next/link';

const PageContent: React.FC = () => {
    const [data, setData] = useState<any>(null);

    React.useEffect(() => {
        fetch('https://microsoftedge.github.io/Demos/json-dummy-data/5MB.json')
            .then(response => response.json())
            .then(data => setData(data));
    }, []);

    if (!data) {
        return <div className='flex justify-center items-center h-screen font-normal text-2xl'> Loading...</div>;
    }

    return (
        <div className="flex flex-col justify-center items-center my-10">
            <Link className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-sky-500 border py-1 px-3 rounded-sm mb-2" href="/">
                Home →
            </Link>
            
            <h1 className="text-2xl font-semibold">Welcome to the About Page</h1>
            {data.map((item: any, index: number) => (
                <p key={index}>{item.name}</p>
            ))}
        </div>
    );
};

export default PageContent;
