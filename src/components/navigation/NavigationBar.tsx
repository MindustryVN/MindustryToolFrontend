import './NavigationBar.css';
import '../../styles.css';
import React, { Component } from 'react';
import UserData from '../common/user/UserData';

export default class NavigationBar extends Component<{ user: UserData | undefined }> {
	render() {
		return (
			<nav className='navigation-bar'>
				<button className='icon' type='button'>
					<img className='menu-icon medium-icon' src='/assets/icons/dots.png' alt='check' />
					<section className='popup '>
						<img src='https://cdn.discordapp.com/attachments/1009013837946695730/1106504291465834596/a_cda53ec40b5d02ffdefa966f2fc013b8.gif' alt=''></img>
						<section className='nav-link-container'>
							<a className='nav-link' href='/home'>
								Home
							</a>
							<a className='nav-link' href='/user'>
								User
							</a>
							<a className='nav-link' href='/forum'>
								Forum
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
							{UserData.isAdmin(this.props.user) && (
								<a className='nav-link' href='/admin'>
									Admin
								</a>
							)}
						</section>
					</section>
				</button>
			</nav>
		);
	}
}
