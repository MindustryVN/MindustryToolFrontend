import './NavigationBar.css';

import React from 'react';
import { useNavigate } from 'react-router-dom';

import { CopyIcon, HomeIcon, MapIcon, MenuIcon } from '../shared/Icon';

const NavigationBar = () => {
	const navigate = useNavigate();

	return (
		<div className='navigation-bar'>
			<div className='icon'>
				<MenuIcon />
				<div className='popup'>
					<img src='https://cdn.discordapp.com/attachments/1009013837946695730/1106504291465834596/a_cda53ec40b5d02ffdefa966f2fc013b8.gif' alt=''></img>
					<div className='nav-link-container'>
						<div className='nav-link' onClick={() => navigate('/home')}>
							Home
						</div>
						<div className='nav-link' onClick={() => navigate('/user')}>
							User
						</div>
						<div className='nav-link' onClick={() => navigate('/schematic')}>
							Schematic
						</div>
						<div className='nav-link' onClick={() => navigate('/map')}>
							Map
						</div>
						<div className='nav-link' onClick={() => navigate('/logic')}>
							Logic
						</div>
						<div className='nav-link' onClick={() => navigate('/upload')}>
							Upload
						</div>
						<div className='nav-link' onClick={() => navigate('/admin')}>
							Admin
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default NavigationBar;
