import React from 'react';

// Lazy load PageContent
const Page = React.lazy(() => import('../about/pageContent'));

const PageWrapper: React.FC = () => (
    <React.Suspense fallback={<div>Loading...</div>}>
        <Page />
    </React.Suspense>
);

export default PageWrapper;
