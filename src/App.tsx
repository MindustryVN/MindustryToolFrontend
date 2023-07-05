import './App.css';
import './styles.css';

import Loading from './components/loader/Loading';
import NavigationPanel from './components/navigation/NavigationPanel';
import AdminRoute from './components/router/AdminRoute';
import PrivateRoute from './components/router/PrivateRoute';
import OAuth2RedirectHandler from './routes/login/OAuth2RedirectHandler';
import UserDisplay from './components/user/UserDisplay';
import UserProvider from './components/provider/UserProvider';
import TagProvider from './components/provider/TagProvider';

import React, { Suspense, useContext, useEffect } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { API } from './API';
import { WEB_VERSION } from './config/Config';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import AlertProvider, { AlertContext } from './components/provider/AlertProvider';

const firebaseConfig = {
	apiKey: 'AIzaSyACF4nOPEHnjPESSj_Ds3G-M90qrLLSL08',
	authDomain: 'mindustrytool.firebaseapp.com',
	projectId: 'mindustrytool',
	storageBucket: 'mindustrytool.appspot.com',
	messagingSenderId: '733073499252',
	appId: '1:733073499252:web:48d86079f479e5fcaa1d21',
	measurementId: 'G-CGKXS6096G'
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const Map = React.lazy(() => import('./routes/map/MapPage'));
const Home = React.lazy(() => import('./routes/home/HomePage'));
const User = React.lazy(() => import('./routes/user/UserPage'));
const Logic = React.lazy(() => import('./routes/logic/LogicPage'));
const Schematic = React.lazy(() => import('./routes/schematic/SchematicPage'));
const Login = React.lazy(() => import('./routes/login/LoginPage'));
const Upload = React.lazy(() => import('./routes/upload/UploadSchematicPage'));
const Admin = React.lazy(() => import('./routes/admin/AdminPage'));
const Forum = React.lazy(() => import('./routes/forum/ForumPage'));
const SchematicPreview = React.lazy(() => import('./routes/schematic/SchematicPreviewPage'));

export default function App() {
	useEffect(() => ping(), []);

	const { useAlert } = useContext(AlertContext);

	function ping() {
		const start = Date.now();
		API.REQUEST.get('ping') //
			.then(() => useAlert(`Ping: ${Date.now() - start}ms`, 5, 'info'));
	}

	return (
		<main className='app'>
			<UserProvider>
				<AlertProvider>
					<TagProvider>
						<Router>
							<section className='navigation-bar'>
								<NavigationPanel />
								<UserDisplay />
							</section>
							<Suspense fallback={<Loading />}>
								<Routes>
									<Route path='/' element={<Navigate to='/home' />} />
									<Route path='/map' element={<Map />} />
									<Route path='/home' element={<Home />} />
									<Route path='/logic' element={<Logic />} />
									<Route path='/login' element={<Login />} />
									<Route path='/upload' element={<Upload />} />
									<Route path='/schematic' element={<Schematic />} />
									<Route path='/schematic/:id' element={<SchematicPreview />} />
									<Route path='/forum/*' element={<Forum></Forum>}></Route>
									<Route path='/user' element={<PrivateRoute element={<User />} />} />
									<Route path='/admin' element={<AdminRoute element={<Admin />} />} />
									<Route path='/oauth2/redirect' element={<OAuth2RedirectHandler />} />
								</Routes>
							</Suspense>
							<footer className='web-version'>{WEB_VERSION}</footer>
						</Router>
					</TagProvider>
				</AlertProvider>
			</UserProvider>
		</main>
	);
}
