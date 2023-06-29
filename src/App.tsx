import './App.css';
import './styles.css';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React, { Suspense, useEffect, useState } from 'react';

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

import OAuth2RedirectHandler from './routes/login/OAuth2RedirectHandler';
import PrivateRoute from './components/router/PrivateRoute';
import NavigationBar from './components/navigation/NavigationBar';
import AdminRoute from './components/router/AdminRoute';
import Loading from './components/common/Loading';
import UserData from './components/common/user/UserData';

import { ACCESS_TOKEN, WEB_VERSION } from './config/Config';
import { API } from './API';

function App() {
	const [currentUser, setCurrentUser] = useState<UserData>();
	const [loading, setLoading] = useState<boolean>(true);

	const start = Date.now();
	API.REQUEST.get('ping') //
		.then(() => console.log(`Ping: ${Date.now() - start}ms`));

	useEffect(() => {
		setLoading(true);
		let accessToken = localStorage.getItem(ACCESS_TOKEN);
		if (accessToken) {
			API.setBearerToken(accessToken);
			API.REQUEST.get('/users') //
				.then((result) => {
					if (result.status === 200) handleLogin(result.data);
					else localStorage.removeItem(ACCESS_TOKEN);
				})
				.catch((error) => handleLogOut())
				.finally(() => setLoading(false));
		} else setLoading(false);
	}, []);

	function handleLogin(user: UserData) {
		if (user) {
			setCurrentUser(user);
		} else handleLogOut();
	}

	function handleLogOut() {
		setCurrentUser(undefined);
		localStorage.removeItem(ACCESS_TOKEN);
	}

	return (
		<main className='app'>
			<Router>
				<img className='mindustry-logo' src='https://cdn.discordapp.com/attachments/1010373926100148356/1106488674935394394/a_cda53ec40b5d02ffdefa966f2fc013b8.gif' alt='Error' hidden></img>
				<NavigationBar user={currentUser} />
				<Suspense fallback={<Loading />}>
					<Routes>
						<Route path='/' element={<Home />} />
						<Route path='/map' element={<Map />} />
						<Route path='/home' element={<Home />} />
						<Route path='/logic' element={<Logic />} />
						<Route path='/login' element={<Login />} />
						<Route path='/upload' element={<Upload user={currentUser} />} />
						<Route path='/schematic' element={<Schematic user={currentUser} />} />
						<Route path='/schematic/:id' element={<SchematicPreview />} />
						<Route path='/forum/*' element={<Forum></Forum>}></Route>
						<Route
							path='/user'
							element={
								<PrivateRoute loading={loading} user={currentUser}>
									<User user={currentUser} />
								</PrivateRoute>
							}
						/>
						<Route
							path='/admin'
							element={
								<AdminRoute loading={loading} user={currentUser}>
									<Admin user={currentUser} />
								</AdminRoute>
							}
						/>
						<Route path='/oauth2/redirect' element={<OAuth2RedirectHandler />} />
					</Routes>
				</Suspense>
				<footer className='web-version'>{WEB_VERSION}</footer>
			</Router>
		</main>
	);
}

export default App;
