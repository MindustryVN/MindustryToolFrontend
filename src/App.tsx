import Loading from 'src/components/Loading';
import NavigationPanel from 'src/components/NavigationPanel';
import AdminRoute from 'src/components/AdminRoute';
import PrivateRoute from 'src/components/PrivateRoute';
import OAuth2RedirectHandler from 'src/routes/login/OAuth2RedirectHandler';

import React, { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ErrorBoundary from 'src/components/ErrorBoundery';

const Map = React.lazy(() => import('src/routes/map/MapPage'));
const MapView = React.lazy(() => import('src/routes/map/MapViewPage'));
const Home = React.lazy(() => import('src/routes/home/HomePage'));
const Me = React.lazy(() => import('src/routes/me/MePage'));
const Logic = React.lazy(() => import('src/routes/logic/LogicPage'));
const Schematic = React.lazy(() => import('src/routes/schematic/SchematicPage'));
const SchematicView = React.lazy(() => import('src/routes/schematic/SchematicViewPage'));
const Login = React.lazy(() => import('src/routes/login/LoginPage'));
const Admin = React.lazy(() => import('src/routes/admin/AdminPage'));
const Forum = React.lazy(() => import('src/routes/post/ForumPage'));
const ForumView = React.lazy(() => import('src/routes/post/ForumViewPage'));
const User = React.lazy(() => import('src/routes/user/UserPage'));
const Notification = React.lazy(() => import('src/routes/notification/NotificationPage'));
const MindustryServer = React.lazy(() => import('src/routes/mindustry-server/MindustryServerPage'));
const UploadSchematic = React.lazy(() => import('src/routes/upload/schematic/UploadSchematicPage'));
const UploadMap = React.lazy(() => import('src/routes/upload/map/UploadMapPage'));
const UploadPost = React.lazy(() => import('src/routes/upload/post/UploadPostPage'));

export default function App() {
	return (
		<main className='flex flex-col w-full h-full overflow-hidden background-gradient'>
			<ErrorBoundary>
				<NavigationPanel />
				<section className='flex flex-col w-screen h-[calc(100%-3rem)] overflow-hidden'>
					<Suspense fallback={<Loading />}>
						<Routes>
							<Route path='/' element={<Navigate to='/home' />} />
							<Route path='/oauth2/redirect' element={<OAuth2RedirectHandler />} />
							<Route path='/home' element={<Home />} />
							<Route path='/logic' element={<Logic />} />
							<Route path='/login' element={<Login />} />
							<Route path='/upload/map' element={<UploadMap />} />
							<Route path='/upload/schematic' element={<UploadSchematic />} />
							<Route path='/upload/post' element={<PrivateRoute element={<UploadPost />} />} />
							<Route path='/map' element={<Map />} />
							<Route path='/map/:mapId' element={<MapView />} />
							<Route path='/schematic' element={<Schematic />} />
							<Route path='/schematic/:schematicId' element={<SchematicView />} />
							<Route path='/post' element={<Forum />} />
							<Route path='/post/post/:postId' element={<ForumView />} />
							<Route path='/user' element={<PrivateRoute element={<Me />} />} />
							<Route path='/user/:userId' element={<PrivateRoute element={<User />} />} />
							<Route path='/admin' element={<AdminRoute element={<Admin />} />} />
							<Route path='/notification' element={<Notification />} />
							<Route path='/server' element={<MindustryServer />} />
						</Routes>
					</Suspense>
				</section>
			</ErrorBoundary>
		</main>
	);
}
