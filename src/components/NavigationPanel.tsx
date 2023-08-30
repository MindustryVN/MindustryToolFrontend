import React, { useState } from 'react';
import { Users } from 'src/data/User';
import { useNavigate } from 'react-router-dom';
import { Trans } from 'react-i18next';
import usePrivateAlert from 'src/hooks/UsePrivateAlert';
import { useMe } from 'src/context/MeProvider';
import useNotification from 'src/hooks/UseNotification';
import UserName from 'src/components/UserName';
import Button from 'src/components/button/Button';
import { WEB_VERSION } from 'src/config/Config';
import OutsideAlerter from 'src/components/common/OutsideAlerter';
import { ReactNode } from 'react-markdown/lib/ast-to-react';
import IfTrue from 'src/components/common/IfTrue';
import ClearButton from 'src/components/button/ClearButton';

interface LinkButtonProps {
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

	const paths: LinkButtonProps[] = [
		{
			name: 'Home',
			to: '/home',
			admin: false,
			icon: (
				<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						d='M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25'
					/>
				</svg>
			),
		},
		{
			name: 'User',
			to: '/user',
			admin: false,
			icon: (
				<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						d='M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z'
					/>
				</svg>
			),
		},
		{
			name: 'Notification',
			to: '/notification',
			admin: false,
			auth: true,
			icon: (() => {
				return (
					<div className='relative'>
						<IfTrue
							condition={unreadNotifications}
							whenTrue={
								<span className='absolute items-center justify-center text-white text-xs bg-red-600 right-0 top-0 px-1 rounded-sm translate-x-2 translate-y-[-50%]'>
									{(unreadNotifications <= 0 ? 0 : unreadNotifications) <= 100 ? unreadNotifications : '100+'}
								</span>
							}
						/>
						<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								d='M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0'
							/>
						</svg>
					</div>
				);
			})(),
		},
		{
			name: 'Schematic',
			to: '/schematic',
			admin: false,
			icon: (
				<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						d='M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z'
					/>
				</svg>
			),
		},
		{
			name: 'Map',
			to: '/map',
			admin: false,
			icon: (
				<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						d='M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z'
					/>
				</svg>
			),
		},
		{
			name: 'Server',
			to: '/server',
			admin: false,
			icon: (
				<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						d='M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z'
					/>
				</svg>
			),
		},
		{
			name: 'Logic',
			to: '/logic',
			admin: false,
			icon: (
				<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						d='M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z'
					/>
				</svg>
			),
		},
		{
			name: 'Info',
			to: '/info',
			admin: false,
			icon: (
				<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						d='M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z'
					/>
				</svg>
			),
		},
		{
			name: 'Admin',
			to: '/admin',
			admin: true,
			icon: (
				<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						d='M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z'
					/>
				</svg>
			),
		},
	];

	function navigateTo(to: string, auth: boolean | undefined) {
		if (auth) {
			privateAlert(() => {
				navigate(to);
				setShowNavigatePanel(false);
			});
		} else {
			navigate(to);
			setShowNavigatePanel(false);
		}
	}

	function LinkButton({ name, to, admin, icon, auth }: LinkButtonProps) {
		if (admin && !Users.isAdmin(me)) return <></>;

		if (window.location.pathname.endsWith(to))
			return (
				<ClearButton className='flex flex-row gap-2 bg-blue-500 dark:bg-gray-500 rounded-lg p-2' onClick={() => navigateTo(to, auth)}>
					{icon}
					{name}
				</ClearButton>
			);

		return (
			<ClearButton className='flex flex-row gap-2 dark:hover:bg-gray-500 rounded-lg p-2' onClick={() => navigateTo(to, auth)}>
				{icon}
				{name}
			</ClearButton>
		);
	}

	function UserPanel() {
		if (me)
			return (
				<section className='flex flex-row justify-between items-center gap-2'>
					<UserName displayUser={me} />
				</section>
			);

		return (
			<section className='flex flex-row justify-between items-center gap-2 p-2'>
				<Button
					onClick={() => {
						navigateTo('/login', false);
					}}>
					<Trans i18nKey='login' />
				</Button>
			</section>
		);
	}

	function NavigationPanel() {
		if (!showNavigatePanel) return <></>;

		return (
			<div className='backdrop-blur-sm absolute w-screen h-screen top-0 left-0' onMouseLeave={() => setShowNavigatePanel(false)}>
				<OutsideAlerter
					className='animate-popup flex flex-col p-2 absolute h-screen min-w-[min(300px,30%)] top-0 left-0 bg-gray-900 overflow-hidden'
					onClickOutside={() => setShowNavigatePanel(false)}>
					<div className='flex flex-col justify-between h-full'>
						<div>
							<p className='text-2xl my-1'>MINDUSTRYTOOL</p>
							<div className='bg-gray-800 h-8 px-2 py-1 text-sm min-w-sm mb-8'>{WEB_VERSION}</div>
							<UserPanel />
							<div className='border-b-2 my-2 border-gray-600' />
							<section
								className='flex flex-col gap-2' //
								children={paths.map((path, index) => (
									<LinkButton key={index} {...path} />
								))}
							/>
						</div>
						<div>
							<div className='border-b-2 my-2 border-gray-600' />
							<ClearButton className='flex flex-row items-center gap-2 mb-2 p-2' onClick={handleLogout}>
								<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										d='M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75'
									/>
								</svg>
								Logout
							</ClearButton>
						</div>
					</div>
				</OutsideAlerter>
			</div>
		);
	}

	return (
		<nav className='h-12 w-screen justify-between items-center bg-gray-950 rounded-b-lg flex flex-row p-2'>
			<section className='flex flex-row justify-between items-center w-full gap-2'>
				<div className='flex flex-row items-center'>
					<button
						type='button'
						onClick={() => setShowNavigatePanel(true)} //
						onFocus={() => setShowNavigatePanel(true)}
						onMouseEnter={() => setShowNavigatePanel(true)}>
						<img className='w-8 h-8 pixelated' src='/assets/icons/dots.png' alt='menu' />
					</button>
				</div>
				<img
					className='w-8 h-8 rounded-lg'
					src='https://cdn.discordapp.com/attachments/1009013837946695730/1106504291465834596/a_cda53ec40b5d02ffdefa966f2fc013b8.gif'
					alt='mindustry-vn-logo'
				/>
				<NavigationPanel />
			</section>
		</nav>
	);
}
