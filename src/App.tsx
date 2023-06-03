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

import { ACCESS_TOKEN } from './config/Config';
import { API } from './AxiosConfig';
import AdminRoute from './components/router/AdminRoute';

function App() {
	const [currentUser, setCurrentUser] = useState<UserInfo>();
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		setLoading(true);
		let accessToken = localStorage.getItem(ACCESS_TOKEN);
		if (accessToken) {
			let headers = { Authorization: 'Bearer ' + accessToken };
			API.get('/users', { headers: headers }) //
				.then((result) => {
					if (result.status === 200) setUser(result.data);
					else localStorage.removeItem(ACCESS_TOKEN);
				})
				.catch((error) => {
					console.log(error);
					handleLogOut();
				})
				.finally(() => setLoading(false));
		} else setLoading(false);
	}, []);

	function setUser(user: UserInfo) {
		if (user) setCurrentUser(user);
		else handleLogOut();
	}

	function handleLogOut() {
		setCurrentUser(undefined);
		localStorage.removeItem(ACCESS_TOKEN);
	}

	if (loading)
		return (
			<div className='image-background'>
				<label className='flexbox-center dark-background'>Loading</label>
			</div>
		);

	return (
		<div className='app image-background'>
			<Router>
				<img className='mindustry-logo' src='https://cdn.discordapp.com/attachments/1010373926100148356/1106488674935394394/a_cda53ec40b5d02ffdefa966f2fc013b8.gif' alt='Error' hidden></img>
				{!loading &&
					(currentUser ? (
						<button className='logout-button dark-background' type='button' onClick={() => handleLogOut()}>
							Logout
						</button>
					) : (
						<a className='logout-button dark-background' href='/login'>
							Login
						</a>
					))}
				<NavigationBar user={currentUser} />
				<Suspense fallback={<label className='flexbox-center'>Loading</label>}>
					<Routes>
						<Route path='/' element={<Home />} />
						<Route path='/map' element={<Map />} />
						<Route path='/home' element={<Home />} />
						<Route path='/logic' element={<Logic />} />
						<Route path='/login' element={<Login />} />
						<Route path='/upload' element={<Upload user={currentUser} />} />
						<Route path='/schematic' element={<Schematic />} />
						<Route path='/forum/*' element={<Forum></Forum>}></Route>
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
