import './index.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { I18nextProvider } from 'react-i18next';
import i18n from './util/I18N';
import UserProvider from './components/provider/UserProvider';
import PopupMessageProvider from './components/provider/PopupMessageProvider';
import TagProvider from './components/provider/TagProvider';
import { BrowserRouter as Router } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
	<React.StrictMode>
		<Router>
			<PopupMessageProvider>
				<TagProvider>
					<UserProvider>
						<I18nextProvider i18n={i18n}>
							<App />
						</I18nextProvider>
					</UserProvider>
				</TagProvider>
			</PopupMessageProvider>
		</Router>
	</React.StrictMode>,
);
