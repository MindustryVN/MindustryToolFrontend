import './index.css';

import { BrowserRouter as Router } from 'react-router-dom';

import App from './App';
import React from 'react';
import ReactDOM from 'react-dom/client';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
	<React.StrictMode>
		<Router>
			<main className='background-gradient h-full w-full '>
				<App />
			</main>
		</Router>
	</React.StrictMode>,
);
