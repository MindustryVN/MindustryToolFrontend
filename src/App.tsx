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
const Home = React.lazy(() => import('src/routes/home/HomePage'));
const Me = React.lazy(() => import('src/routes/me/MePage'));
const Logic = React.lazy(() => import('src/routes/logic/LogicPage'));
const Schematic = React.lazy(() => import('src/routes/schematic/SchematicPage'));
const Login = React.lazy(() => import('src/routes/login/LoginPage'));
const Upload = React.lazy(() => import('src/routes/upload/UploadPage'));
const Admin = React.lazy(() => import('src/routes/admin/AdminPage'));
const Forum = React.lazy(() => import('src/routes/forum/ForumPage'));
const Info = React.lazy(() => import('src/routes/info/Info'));
const User = React.lazy(() => import('src/routes/user/UserPage'));
const Mod = React.lazy(() => import('src/routes/mod/ModPage'));
const MapPreview = React.lazy(() => import('src/routes/map/MapPreviewPage'));
const Notification = React.lazy(() => import('src/routes/notification/NotificationPage'));
const SchematicPreview = React.lazy(() => import('src/routes/schematic/SchematicPreviewPage'));
const MindustryServer = React.lazy(() => import('src/routes/mindustry-server/MindustryServerPage'));

export default function App() {
	return (
		<main className='h100p w100p'>
			<ErrorBoundary>
				<NavigationPanel />
				<section className='main background-image-1'>
					<Suspense fallback={<Loading />}>
						<Routes>
							<Route path='/oauth2/redirect' element={<OAuth2RedirectHandler />} />
							<Route path='/' element={<Navigate to='/home' />} />
							<Route path='/home' element={<Home />} />
							<Route path='/logic' element={<Logic />} />
							<Route path='/login' element={<Login />} />
							<Route path='/mod' element={<Mod />} />
							<Route path='/upload' element={<Upload />} />
							<Route path='/map' element={<Map />} />
							<Route path='/map/:mapId' element={<MapPreview />} />
							<Route path='/schematic' element={<Schematic />} />
							<Route path='/schematic/:schematicId' element={<SchematicPreview />} />
							<Route path='/forum/*' element={<Forum />} />
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
