import React, { useState } from 'react';
import User, { Users } from 'src/data/User';
import { Link, useNavigate } from 'react-router-dom';
import { Trans } from 'react-i18next';
import usePrivateAlert from 'src/hooks/UsePrivateAlert';
import { useMe } from 'src/context/MeProvider';
import useNotification from 'src/hooks/UseNotification';
import Button from 'src/components/Button';
import { WEB_VERSION } from 'src/config/Config';
import OutsideAlerter from 'src/components/OutsideAlerter';
import { ReactNode } from 'react-markdown/lib/ast-to-react';
import IfTrue from 'src/components/IfTrue';
import ClearButton from 'src/components/ClearButton';
import i18n from 'src/util/I18N';
import { AdminIcon, BellIcon, HomeIcon, InfoIcon, LogicIcon, LogoutIcon, MapIcon, PostIcon, SchematicIcon, ServerIcon, UserIcon, WebIcon } from 'src/components/Icon';
import LineDivider from 'src/components/LineDivider';
import UserRoleDisplay from 'src/components/UserRoleDisplay';
import UserAvatar from 'src/components/UserAvatar';

interface LinkButton {
	name: string;
	to: string;
	admin: boolean;
	icon: ReactNode;
	auth?: boolean;
}

export default function NavigationPanel() {
	const navigate = useNavigate();
	const privateAlert = usePrivateAlert();
	const { me, handleLogout } = useMe();
	const { unreadNotifications } = useNotification();
	const [showNavigatePanel, setShowNavigatePanel] = useState(false);

	const paths: LinkButton[] = [
		{
			name: i18n.t('home'),
			to: '/home',
			admin: false,
			icon: <HomeIcon className='w-6 h-6' />,
		},
		{
			name: i18n.t('user'),
			to: '/user',
			admin: false,
			icon: <UserIcon className='w-6 h-6' />,
		},
		{
			name: i18n.t('schematic'),
			to: '/schematic',
			admin: false,
			icon: <SchematicIcon className='w-6 h-6' />,
		},
		{
			name: i18n.t('map'),
			to: '/map',
			admin: false,
			icon: <MapIcon className='w-6 h-6' />,
		},
		{
			name: i18n.t('post'),
			to: '/post',
			admin: false,
			icon: <PostIcon className='w-6 h-6' />,
		},
		{
			name: i18n.t('server'),
			to: '/server',
			admin: false,
			icon: <ServerIcon className='w-6 h-6' />,
		},
		{
			name: i18n.t('logic'),
			to: '/logic',
			admin: false,
			icon: <LogicIcon className='w-6 h-6' />,
		},
		{
			name: i18n.t('information'),
			to: '/info',
			admin: false,
			icon: <InfoIcon className='w-6 h-6' />,
		},
		{
			name: i18n.t('admin'),
			to: '/admin',
			admin: true,
			icon: <AdminIcon className='w-6 h-6' />,
		},
	];

	function navigateTo(to: string, auth: boolean | undefined) {
		if (!auth) {
			navigate(to);
			setShowNavigatePanel(false);
			return;
		}
		privateAlert(() => {
			navigate(to);
			setShowNavigatePanel(false);
		});
	}

	function LinkButton({ name, to, admin, icon, auth }: LinkButton) {
		if (admin && !Users.isAdmin(me)) return <></>;

		return (
			<ClearButton className='flex flex-row gap-2 rounded-lg p-2 hover:bg-blue-500' active={window.location.pathname.endsWith(to)} title={name} onClick={() => navigateTo(to, auth)}>
				<span className='flex gap-2'>
					{icon}
					{name}
				</span>
			</ClearButton>
		);
	}

	function UserDisplay({ me }: { me: User }) {
		return (
			<div className='flex flex-row gap-2 justify-between items-center cursor-pointer' onClick={() => navigateTo(`/user/${me.id}`, false)}>
				<section className='flex flex-row justify-center items-center gap-2'>
					<UserAvatar className='w-12 h-12 rounded-xl' user={me} />
					<section className='h-full text-xl flex flex-col'>
						<p className='capitalize'>{me.name}</p>
						<UserRoleDisplay roles={me.role} />
					</section>
				</section>
				<ClearButton
					className='flex flex-row justify-center items-center gap-2 p-2 dark:hover:bg-blue-500 dark:hover:text-white rounded-lg'
					title={i18n.t('logout')}
					onClick={handleLogout}>
					<LogoutIcon className='w-6 h-6' />
				</ClearButton>
			</div>
		);
	}

	function LoginButton() {
		return (
			<section className='flex flex-col'>
				<Button className='flex flex-col dark:hover:bg-blue-500 dark:hover:text-white p-2' title={i18n.t('login')} onClick={() => navigateTo('/login', false)}>
					<Trans i18nKey='login' />
				</Button>
			</section>
		);
	}

	function NavigationPanel() {
		if (!showNavigatePanel) return <></>;

		return (
			<div className='backdrop-blur-sm fixed w-screen h-screen top-0 left-0 z-nav-bar'>
				<OutsideAlerter
					className='animate-popup flex flex-col p-2 absolute h-screen min-w-[min(300px,30%)] top-0 left-0 bg-gray-900 overflow-hidden'
					onClickOutside={() => setShowNavigatePanel(false)}>
					<div className='flex flex-col justify-between h-full'>
						<div className='flex flex-col gap-2 w-full'>
							<Link className='text-2xl' to='/'>
								MINDUSTRYTOOL
							</Link>
							<div className='bg-gray-800 h-8 px-2 py-1 text-sm min-w-sm'>{WEB_VERSION}</div>
							<LineDivider />
							<section
								className='flex flex-col gap-2'
								children={paths.map((path, index) => (
									<LinkButton key={index} {...path} />
								))}
							/>
						</div>
						<IfTrue
							condition={me !== undefined}
							whenTrue={
								<div className='flex flex-col'>
									<div className='border-b-2 my-2 border-gray-600' />
									{me ? <UserDisplay me={me} /> : <LoginButton />}
								</div>
							}
						/>
					</div>
				</OutsideAlerter>
			</div>
		);
	}

	return (
		<nav className='h-12 w-screen justify-between items-center bg-gray-950 rounded-b-lg flex flex-row p-2'>
			<section className='flex flex-row justify-between items-center w-full gap-4'>
				<div className='flex flex-row items-center'>
					<button
						type='button'
						onClick={() => setShowNavigatePanel(true)} //
						onFocus={() => setShowNavigatePanel(true)}
						onMouseEnter={() => setShowNavigatePanel(true)}>
						<img className='w-8 h-8 pixelated' src='/assets/icons/dots.png' alt='menu' />
					</button>
				</div>
				<section className='flex flex-row gap-2 items-center'>
					<ClearButton className='relative cursor-pointer' onClick={() => navigate('notification')} title=''>
						<IfTrue
							condition={unreadNotifications}
							whenTrue={
								<span className='absolute items-center justify-center text-white text-xs bg-red-600 right-0 top-0 px-1 rounded-sm translate-x-2 translate-y-[-50%]'>
									{(unreadNotifications <= 0 ? 0 : unreadNotifications) <= 100 ? unreadNotifications : '100+'}
								</span>
							}
						/>
						<BellIcon className='w-6 h-6' />
					</ClearButton>
					<WebIcon />
				</section>
				<NavigationPanel />
			</section>
		</nav>
	);
}
