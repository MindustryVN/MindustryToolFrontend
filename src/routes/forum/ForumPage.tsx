import './ForumPage.css';

import { Route, Routes } from 'react-router-dom';

import React from 'react';

const HowToDownloadMindustry = React.lazy(() => import('./posts/HowToDownloadMindustry'));

export default function ForumPage ()  {
	return (
		<div className='forum'>
			<Routes>
				<Route path='/how-to-download-mindustry' Component={HowToDownloadMindustry} />
			</Routes>
		</div>
	);
};
