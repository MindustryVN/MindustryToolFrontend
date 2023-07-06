import './NavigationPanel.css';
import '../../styles.css';

import React, { useContext, useState } from 'react';
import UserData from '../user/UserData';
import { Link } from 'react-router-dom';
import { UserContext } from '../provider/UserProvider';
import { Trans } from 'react-i18next';

export default function NavigationPanel() {
	const { user } = useContext(UserContext);

	const [showNavigatePanel, setShowNavigatePanel] = useState(false);

	return (
		<nav className='navigation-panel'>
			<button className='icon flex-center w2rem h2rem' type='button' onClick={() => setShowNavigatePanel((prev) => !prev)} onMouseEnter={() => setShowNavigatePanel(true)}>
				<img className='icon w2rem h2rem' src='/assets/icons/dots.png' alt='menu' />
			</button>

			{showNavigatePanel && (
				<section className='popup' onMouseLeave={() => setShowNavigatePanel(false)}>
					<section className='nav-link-container'>
					<img src='https://cdn.discordapp.com/attachments/1009013837946695730/1106504291465834596/a_cda53ec40b5d02ffdefa966f2fc013b8.gif' alt='' />
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
						<Link className='nav-link' to='/info'>
							Info
						</Link>
						{UserData.isAdmin(user) && (
							<Link className='nav-link' to='/admin'>
								Admin
							</Link>
						)}
					</section>
					<button className='button' type='button' onClick={() => setShowNavigatePanel(false)}>
						<Trans i18nKey='navigate.close'/>
					</button>
				</section>
			)}
		</nav>
	);
}
