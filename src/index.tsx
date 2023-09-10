import './index.css';

import { BrowserRouter as Router } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';

import App from './App';
import i18n from './util/I18N';
import React from 'react';
import ReactDOM from 'react-dom/client';
import TagProvider from 'src/context/TagProvider';
import UserProvider from 'src/context/MeProvider';
import PopupMessageProvider from 'src/context/PopupMessageProvider';
import NotificationProvider from 'src/context/NotificationProvider';
import { WindowContextProvider } from 'src/context/WindowFocusContext';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
	<React.StrictMode>
		<Router>
			<WindowContextProvider>
				<I18nextProvider i18n={i18n}>
					<PopupMessageProvider>
						<TagProvider>
							<UserProvider>
								<NotificationProvider>
									<App />
								</NotificationProvider>
							</UserProvider>
						</TagProvider>
					</PopupMessageProvider>
				</I18nextProvider>
			</WindowContextProvider>
		</Router>
	</React.StrictMode>,
);
