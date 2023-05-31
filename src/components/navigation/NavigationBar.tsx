import './NavigationBar.css';
import '../../styles.css';
import React, { Component } from 'react';

export default class NavigationBar extends Component<{ authenticated: boolean; user: UserInfo | undefined }> {
	render() {
		return (
			<nav className='navigation-bar'>
				<div className='icon'>
					<img className='menu-icon medium-icon' src='/assets/icons/dots.png' alt='check' />
					<div className='popup dark-background'>
						<img src='https://cdn.discordapp.com/attachments/1009013837946695730/1106504291465834596/a_cda53ec40b5d02ffdefa966f2fc013b8.gif' alt=''></img>
						<div className='nav-link-container'>
							<a className='nav-link' href='/home'>
								Home
							</a>
							<a className='nav-link' href='/user'>
								User
							</a>
							<a className='nav-link' href='/schematic'>
								Schematic
							</a>
							<a className='nav-link' href='/map'>
								Map
							</a>
							<a className='nav-link' href='/logic'>
								Logic
							</a>
							<a className='nav-link' href='/upload'>
								Upload
							</a>
							{this.props.authenticated && this.props.user && this.props.user.role.includes('ADMIN') && (
								<a className='nav-link' href='/admin'>
									Admin
								</a>
							)}
						</div>
					</div>
				</div>
			</nav>
		);
	}
}
