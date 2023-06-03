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

import PrivateRoute from './components/router/PrivateRoute';
import NavigationBar from './components/navigation/NavigationBar';
import OAuth2RedirectHandler from './routes/login/OAuth2RedirectHandler';

import { ACCESS_TOKEN, USER_DATA } from './config/Config';
import { API } from './AxiosConfig';
import AdminRoute from './components/router/AdminRoute';

function App() {
	const [authenticated, setAuthenticated] = useState<boolean>(false);
	const [currentUser, setCurrentUser] = useState<UserInfo>();
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		try {
			setLoading(true);

			let accessToken = localStorage.getItem(ACCESS_TOKEN);
			if (accessToken) {
				let headers = { Authorization: 'Bearer ' + accessToken };
				API.get('/users', { headers: headers }) //
					.then((result) => setUser(result.data))
					.catch((error) => console.log(error))
					.finally(() => setLoading(false));
			} else setLoading(false);
		} catch (e) {
			handleLogOut();
		}
	}, []);

	function setUser(user: UserInfo) {
		if (user) {
			setAuthenticated(true);
			setCurrentUser(user);
		} else console.log('Login failed');
	}

	function handleLogOut() {
		setAuthenticated(false);
		setCurrentUser(undefined);

		localStorage.removeItem(USER_DATA);
		localStorage.removeItem(ACCESS_TOKEN);
	}

	return (
		<div className='app image-background'>
			<Router>
				<img className='mindustry-logo' src='https://cdn.discordapp.com/attachments/1010373926100148356/1106488674935394394/a_cda53ec40b5d02ffdefa966f2fc013b8.gif' alt='Error' hidden></img>

				{authenticated ? (
					<button className='logout-button dark-background' type='button' onClick={() => handleLogOut()}>
						Logout
					</button>
				) : (
					<button className='logout-button dark-background' type='button'>
						<a href='/login'>Login</a>
					</button>
				)}
				<NavigationBar authenticated={authenticated} user={currentUser} />
				<Suspense fallback={<label className='flexbox-center'>Loading</label>}>
					<Routes>
						<Route path='/' element={<Home />} />
						<Route path='/map' element={<Map />} />
						<Route path='/home' element={<Home />} />
						<Route path='/logic' element={<Logic />} />
						<Route path='/login' element={<Login />} />
						<Route path='/upload' element={<Upload user={currentUser} />} />
						<Route path='/schematic' element={<Schematic />} />
						<Route path='/forum/*' element={<Forum></Forum>}>
						</Route>
						<Route
							path='/user'
							element={
								<PrivateRoute user={currentUser}>
									<User user={currentUser} />
								</PrivateRoute>
							}
						/>
						<Route
							path='/admin'
							element={
								<AdminRoute user={currentUser}>
									<Admin user={currentUser} />
								</AdminRoute>
							}
						/>
						<Route path='/oauth2/redirect' element={<OAuth2RedirectHandler />} />
					</Routes>
				</Suspense>
			</Router>
		</div>
	);
}

export default App;
