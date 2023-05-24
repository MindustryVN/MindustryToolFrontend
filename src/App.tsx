import './App.css';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import React, { Suspense } from 'react';

const Map = React.lazy(() => import('./components/map/Map'));
const Home = React.lazy(() => import('./components/home/Home'));
const User = React.lazy(() => import('./components/user/User'));
const Logic = React.lazy(() => import('./components/logic/Logic'));
const Schematic = React.lazy(() => import('./components/schematic/Schematic'));
const Login = React.lazy(() => import('./components/login/Login'));
const Logout = React.lazy(() => import('./components/logout/Logout'));
const Upload = React.lazy(() => import('./components/upload/Upload'));
const Admin = React.lazy(() => import('./components/admin/Admin'));

import NavigationBar from './components/navigation/NavigationBar';

function App() {
	return (
		<div className='app'>
			<Router>
				<img className='mindustry-logo' src='https://cdn.discordapp.com/attachments/1010373926100148356/1106488674935394394/a_cda53ec40b5d02ffdefa966f2fc013b8.gif' alt='Error' hidden></img>
				<NavigationBar />
				<Suspense fallback={<NavigationBar />}>
					<Routes>
						<Route path='/' element={<Home />} />
						<Route path='/home' element={<Home />} />
						<Route path='/schematic' element={<Schematic />} />
						<Route path='/map' element={<Map />} />
						<Route path='/logic' element={<Logic />} />
						<Route path='/user' element={<User />} />
						<Route path='/login' element={<Login />} />
						<Route path='/logout' element={<Logout />} />
						<Route path='/upload' element={<Upload />} />
						<Route path='/admin' element={<Admin />} />{' '}
					</Routes>
				</Suspense>
			</Router>
		</div>
	);
}

export default App;
