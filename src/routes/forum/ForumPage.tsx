import './ForumPage.css';

import { Route, Routes } from 'react-router-dom';

import React from 'react';

const HowToDownloadMindustry = React.lazy(() => import('./posts/HowToDownloadMindustry'));

export default function ForumPage() {
	return (
		<main className='flex-column h100p w100p scroll-y'>
			<Routes>
				<Route path='/how-to-download-mindustry' Component={HowToDownloadMindustry} />
			</Routes>
		</main>
	);
}
