import './App.css';
import './styles.css';

import Loading from 'src/components/loader/Loading';
import NavigationPanel from 'src/components/navigation/NavigationPanel';
import AdminRoute from 'src/components/router/AdminRoute';
import PrivateRoute from 'src/components/router/PrivateRoute';
import OAuth2RedirectHandler from 'src/routes/login/OAuth2RedirectHandler';

import React, { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { WEB_VERSION } from './config/Config';
import ErrorBoundary from 'src/components/common/ErrorBoundery';
// import { initializeApp } from 'firebase/app';
// import { getAnalytics } from 'firebase/analytics';

// const firebaseConfig = {
// 	apiKey: 'AIzaSyACF4nOPEHnjPESSj_Ds3G-M90qrLLSL08',
// 	authDomain: 'mindustrytool.firebaseapp.com',
// 	projectId: 'mindustrytool',
// 	storageBucket: 'mindustrytool.appspot.com',
// 	messagingSenderId: '733073499252',
// 	appId: '1:733073499252:web:48d86079f479e5fcaa1d21',
// 	measurementId: 'G-CGKXS6096G'
// };

// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const Map = React.lazy(() => import('src/routes/map/MapPage'));
const MapView = React.lazy(() => import('src/routes/map/MapViewPage'));
const Home = React.lazy(() => import('src/routes/home/HomePage'));
const Me = React.lazy(() => import('src/routes/me/MePage'));
const Logic = React.lazy(() => import('src/routes/logic/LogicPage'));
const Schematic = React.lazy(() => import('src/routes/schematic/SchematicPage'));
const SchematicView = React.lazy(() => import('src/routes/schematic/SchematicViewPage'));
const Login = React.lazy(() => import('src/routes/login/LoginPage'));
const Admin = React.lazy(() => import('src/routes/admin/AdminPage'));
const Forum = React.lazy(() => import('src/routes/forum/ForumPage'));
const ForumView = React.lazy(() => import('src/routes/forum/ForumViewPage'));
const Info = React.lazy(() => import('src/routes/info/Info'));
const User = React.lazy(() => import('src/routes/user/UserPage'));
const Mod = React.lazy(() => import('src/routes/mod/ModPage'));
const Notification = React.lazy(() => import('src/routes/notification/NotificationPage'));
const MindustryServer = React.lazy(() => import('src/routes/mindustry-server/MindustryServerPage'));
const UploadSchematic = React.lazy(() => import('src/routes/upload/schematic/UploadSchematicPage'));
const UploadMap = React.lazy(() => import('src/routes/upload/map/UploadMapPage'));
const UploadPost = React.lazy(() => import('src/routes/upload/post/UploadPostPage'));

export default function App() {
	return (
		<main className='h100p w100p'>
			<ErrorBoundary>
				<NavigationPanel />
				<section className='main background-image-1'>
					<Suspense fallback={<Loading />}>
						<Routes>
							<Route path='/' element={<Navigate to='/home' />} />
							<Route path='/oauth2/redirect' element={<OAuth2RedirectHandler />} />
							<Route path='/home' element={<Home />} />
							<Route path='/logic' element={<Logic />} />
							<Route path='/login' element={<Login />} />
							<Route path='/mod' element={<Mod />} />
							<Route path='/upload/map' element={<UploadMap />} />
							<Route path='/upload/schematic' element={<UploadSchematic />} />
							<Route path='/upload/post' element={<PrivateRoute element={<UploadPost />} />} />
							<Route path='/map' element={<Map />} />
							<Route path='/map/:mapId' element={<MapView />} />
							<Route path='/schematic' element={<Schematic />} />
							<Route path='/schematic/:schematicId' element={<SchematicView />} />
							<Route path='/forum' element={<Forum />} />
							<Route path='/forum/post/:postId' element={<ForumView />} />
							<Route path='/user' element={<PrivateRoute element={<Me />} />} />
							<Route path='/user/:userId' element={<PrivateRoute element={<User />} />} />
							<Route path='/admin' element={<AdminRoute element={<Admin />} />} />
							<Route path='/info' element={<Info />} />
							<Route path='/notification' element={<Notification />} />
							<Route path='/mindustry-server' element={<MindustryServer />} />
						</Routes>
					</Suspense>
				</section>
				<footer className='web-version'>{WEB_VERSION}</footer>
			</ErrorBoundary>
		</main>
	);
}
