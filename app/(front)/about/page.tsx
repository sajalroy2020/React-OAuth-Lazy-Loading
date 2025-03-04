import React from 'react';

const Page: React.FC = () => {
    return (
        <div className='h-screen flex flex-col justify-center items-center'>
            <h1 className='text-2xl font-semibold'>Welcome to the About Page</h1>
            <p>This is the About page of your React application.</p>
        </div>
    );
};

export default Page;