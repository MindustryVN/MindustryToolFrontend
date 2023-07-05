import './NavigationPanel.css';
import '../../styles.css';

import React, { useContext } from 'react';
import UserData from '../user/UserData';
import { Link } from 'react-router-dom';
import { UserContext } from '../provider/UserProvider';

export default function NavigationPanel() {
	const { user } = useContext(UserContext);

	return (
		<nav className='navigation-panel'>
			<button className='icon w2rem h2rem' type='button'>
				<img className='menu-icon w2rem h2rem' src='/assets/icons/dots.png' alt='check' />
				<section className='popup'>
					<img src='https://cdn.discordapp.com/attachments/1009013837946695730/1106504291465834596/a_cda53ec40b5d02ffdefa966f2fc013b8.gif' alt='' />
					<section className='nav-link-container'>
						<Link className='nav-link' to='/home'>
							Home
						</Link>
						<Link className='nav-link' to='/user'>
							User
						</Link>
						<Link className='nav-link' to='/forum'>
							Forum
						</Link>
						<Link className='nav-link' to='/schematic'>
							Schematic
						</Link>
						<Link className='nav-link' to='/map'>
							Map
						</Link>
						<Link className='nav-link' to='/logic'>
							Logic
						</Link>
						<Link className='nav-link' to='/upload'>
							Upload
						</Link>
						{UserData.isAdmin(user) && (
							<Link className='nav-link' to='/admin'>
								Admin
							</Link>
						)}
					</section>
				</section>
			</button>
		</nav>
	);
}
