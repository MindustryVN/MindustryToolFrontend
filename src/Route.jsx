import React from 'react';
import { Route } from 'react-router';
import { Routes } from 'react-router-dom';

export default (
	<Routes>
		<Route path='/' />
		<Route path='/oauth2/redirect' />
		<Route path='/home' />
		<Route path='/logic' />
		<Route path='/login' />
		<Route path='/upload/map' />
		<Route path='/upload/schematic' />
		<Route path='/upload/post' />
		<Route path='/map' />
		<Route path='/map/:mapId' />
		<Route path='/schematic' />
		<Route path='/schematic/:schematicId' />
		<Route path='/forum' />
		<Route path='/forum/post/:postId' />
		<Route path='/user' />
		<Route path='/user/:userId' />
		<Route path='/admin' />
		<Route path='/info' />
		<Route path='/notification' />
		<Route path='/mindustry-server' />
	</Routes>
);
