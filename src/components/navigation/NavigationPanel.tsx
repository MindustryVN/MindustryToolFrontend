import './NavigationPanel.css';
import 'src/styles.css';

import React, { useState } from 'react';
import { Users } from 'src/data/User';
import { Link, useNavigate } from 'react-router-dom';
import { Trans } from 'react-i18next';
import ClearButton from 'src/components/button/ClearButton';
import UserDisplay from 'src/components/user/UserDisplay';
import ClearIconButton from 'src/components/button/ClearIconButton';
import usePrivateAlert from 'src/hooks/UsePrivateAlert';
import useMe from 'src/hooks/UseMe';
import IfTrue from 'src/components/common/IfTrue';
import useNotification from 'src/hooks/UseNotification';
import ThemeSwitcher from 'src/components/theme/ThemeSwitcher';

export default function NavigationPanel() {
	const { me } = useMe();

	const { unreadNotifications } = useNotification();

	const [showNavigatePanel, setShowNavigatePanel] = useState(false);

	const pathName = window.location.pathname.slice(1);

	const navigate = useNavigate();
	const PrivateAlert = usePrivateAlert();

	return (
		<nav className='navigation-bar'>
			<section className='navigation-panel'>
				<button
					className='icon flex-center w2rem h2rem'
					type='button'
					onClick={() => setShowNavigatePanel((prev) => !prev)}
					onFocus={() => setShowNavigatePanel(true)}
					onMouseEnter={() => setShowNavigatePanel(true)}>
					<img className='icon w2rem h2rem' src='/assets/icons/menu.png' alt='menu' />
				</button>

				{showNavigatePanel && (
					<section className='popup' onMouseLeave={() => setShowNavigatePanel(false)}>
						<section className='nav-link-container'>
							<img src='https://cdn.discordapp.com/attachments/1009013837946695730/1106504291465834596/a_cda53ec40b5d02ffdefa966f2fc013b8.gif' alt='' />
							<Link className={'nav-link ' + (pathName.startsWith('home') ? 'active' : '')} to='/home' onClick={() => setShowNavigatePanel(false)}>
								Home
							</Link>
							<Link className={'nav-link ' + (pathName.startsWith('user') ? 'active' : '')} to='/user' onClick={() => setShowNavigatePanel(false)}>
								User
							</Link>
							<Link className={'nav-link ' + (pathName.startsWith('forum') ? 'active' : '')} to='/forum' onClick={() => setShowNavigatePanel(false)}>
								Forum
							</Link>
							<Link className={'nav-link ' + (pathName.startsWith('schematic') ? 'active' : '')} to='/schematic' onClick={() => setShowNavigatePanel(false)}>
								Schematic
							</Link>
							<Link className={'nav-link ' + (pathName.startsWith('map') ? 'active' : '')} to='/map' onClick={() => setShowNavigatePanel(false)}>
								Map
							</Link>
							<Link className={'nav-link ' + (pathName.startsWith('mod') ? 'active' : '')} to='/mod' onClick={() => setShowNavigatePanel(false)}>
								Mod
							</Link>
							<Link className={'nav-link ' + (pathName.startsWith('logic') ? 'active' : '')} to='/logic' onClick={() => setShowNavigatePanel(false)}>
								Logic
							</Link>
							<Link className={'nav-link ' + (pathName.startsWith('server') ? 'active' : '')} to='/mindustry-server' onClick={() => setShowNavigatePanel(false)}>
								Server
							</Link>
							<Link className={'nav-link ' + (pathName.startsWith('info') ? 'active' : '')} to='/info' onClick={() => setShowNavigatePanel(false)}>
								Info
							</Link>
							{Users.isAdmin(me) && (
								<Link className={'nav-link ' + (pathName.startsWith('admin') ? 'active' : '')} to='/admin' onClick={() => setShowNavigatePanel(false)}>
									Admin
								</Link>
							)}
						</section>
						<ClearButton onClick={() => setShowNavigatePanel(false)}>
							<Trans i18nKey='close' />
						</ClearButton>
					</section>
				)}
			</section>
			<section className='flex-row center big-gap relative '>
				<ThemeSwitcher />
				<section className='relative'>
					<ClearIconButton
						className='bell-icon small-padding'
						title='notification'
						icon='/assets/icons/chat.png' //
						onClick={() => PrivateAlert(() => navigate('/notification'))}
					/>
					<IfTrue
						condition={unreadNotifications}
						whenTrue={<span className='unread-notification-number'>{(unreadNotifications > 0 ? unreadNotifications : 0) <= 100 ? unreadNotifications : '100+'}</span>}
					/>
				</section>
				<UserDisplay />
			</section>
		</nav>
	);
}
