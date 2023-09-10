import React, { Fragment, useCallback, useMemo, useState } from 'react';
import { Users } from 'src/data/User';
import { Link, useNavigate } from 'react-router-dom';
import { Trans } from 'react-i18next';
import usePrivateAlert from 'src/hooks/UsePrivateAlert';
import { useMe } from 'src/context/MeProvider';
import useNotification from 'src/hooks/UseNotification';
import { WEB_VERSION } from 'src/config/Config';
import OutsideAlerter from 'src/components/OutsideAlerter';
import { ReactNode } from 'react-markdown/lib/ast-to-react';
import IfTrue from 'src/components/IfTrue';
import ClearButton from 'src/components/ClearButton';
import i18n from 'src/util/I18N';
import { AdminIcon, BellIcon, CalculatorIcon, HomeIcon, LogicIcon, LoginIcon, LogoutIcon, MapIcon, PostIcon, SchematicIcon, ServerIcon, UserIcon, WebIcon } from 'src/components/Icon';
import LineDivider from 'src/components/LineDivider';
import UserRoleDisplay from 'src/components/UserRoleDisplay';
import UserAvatar from 'src/components/UserAvatar';
import { cn } from 'src/util/Utils';

interface Path {
	name: string;
	to: string;
	admin?: boolean;
	icon: ReactNode;
}

export default function NavigationPanel() {
	const navigate = useNavigate();
	const privateAlert = usePrivateAlert();
	const { me } = useMe();
	const { unreadNotifications } = useNotification();
	const [showNavigatePanel, setShowNavigatePanel] = useState(false);

	const paths: Path[] = useMemo(
		() => [
			{
				name: i18n.t('home'),
				to: '/home',
				icon: <HomeIcon className='h-6 w-6' />,
			},
			{
				name: i18n.t('user'),
				to: '/user',
				icon: <UserIcon className='h-6 w-6' />,
			},
			{
				name: i18n.t('schematic'),
				to: '/schematic',
				icon: <SchematicIcon className='h-6 w-6' />,
			},
			{
				name: i18n.t('map'),
				to: '/map',
				icon: <MapIcon className='h-6 w-6' />,
			},
			{
				name: i18n.t('post'),
				to: '/post',
				icon: <PostIcon className='h-6 w-6' />,
			},
			{
				name: i18n.t('server'),
				to: '/server',
				icon: <ServerIcon className='h-6 w-6' />,
			},
			{
				name: i18n.t('logic'),
				to: '/logic',
				icon: <LogicIcon className='h-6 w-6' />,
			},
			{
				name: i18n.t('ratio-calculator'),
				to: '/ratio-calculator',
				icon: <CalculatorIcon className='h-6 w-6' />,
			},
			{
				name: i18n.t('notification'),
				to: '/notification',
				icon: (
					<div className='relative cursor-pointer' onClick={() => navigate('notification')} title=''>
						<IfTrue
							condition={unreadNotifications}
							whenTrue={
								<span className='absolute right-0 top-0 translate-x-2 translate-y-[-50%] items-center justify-center rounded-sm bg-red-600 px-1 text-xs text-white'>
									{(unreadNotifications <= 0 ? 0 : unreadNotifications) <= 100 ? unreadNotifications : '100+'}
								</span>
							}
						/>
						<BellIcon className='h-6 w-6' />
					</div>
				),
			},
			{
				name: i18n.t('admin'),
				to: '/admin',
				admin: true,
				icon: <AdminIcon className='h-6 w-6' />,
			},
		],
		[unreadNotifications, navigate],
	);

	const navigateTo = useCallback(
		(to: string, auth: boolean | undefined) => {
			if (!auth) {
				navigate(to);
				setShowNavigatePanel(false);
				return;
			}
			privateAlert(() => {
				navigate(to);
				setShowNavigatePanel(false);
			});
		},
		[navigate, privateAlert, setShowNavigatePanel],
	);

	return useMemo(
		() => (
			<nav className='flex h-[49px] w-screen flex-row items-center justify-between bg-gray-950 p-2'>
				<section className='flex w-full flex-row items-center justify-between gap-4'>
					<div className='flex flex-row items-center'>
						<button
							type='button'
							onClick={() => setShowNavigatePanel(true)} //
							onFocus={() => setShowNavigatePanel(true)}
							onMouseEnter={() => setShowNavigatePanel(true)}>
							<img className='pixelated h-8 w-8' src='/assets/icons/dots.png' alt='menu' />
						</button>
					</div>
					<WebIcon />
				</section>
				<div className={cn('fixed left-0 top-0 z-nav-bar h-full w-full backdrop-blur-sm', { hidden: !showNavigatePanel })}>
					<OutsideAlerter
						className='absolute left-0 top-0 box-border flex h-full min-w-[min(300px,30%)] animate-popup flex-col overflow-hidden bg-gray-900 p-2'
						onClickOutside={() => setShowNavigatePanel(false)}>
						<div className='flex h-full flex-col justify-between'>
							<div className='flex w-full flex-col gap-2'>
								<Link className='bg-gradient-to-r from-emerald-500 to-sky-500 bg-clip-text text-2xl text-transparent' to='/'>
									MINDUSTRYTOOL
								</Link>
								<div className='min-w-sm h-8 bg-gray-800 px-2 py-1 text-sm'>{WEB_VERSION}</div>
								<LineDivider />
								<section
									className='flex flex-col gap-2'
									children={paths.map((path, index) => (
										<LinkButton key={index} {...path} onClick={() => navigateTo(path.to, path.admin)} />
									))}
								/>
							</div>
							<div className='flex flex-col'>
								<div className='my-2 border-b-2 border-gray-600' />
								{me ? <UserDisplay onClick={() => navigateTo(`/user/${me.id}`, false)} /> : <LoginButton onClick={() => navigateTo('/login', false)} />}
							</div>
						</div>
					</OutsideAlerter>
				</div>
			</nav>
		),
		[me, paths, showNavigatePanel, navigateTo],
	);
}

interface LinkButtonProps {
	name: string;
	to: string;
	admin?: boolean;
	icon: ReactNode;
	onClick: () => void;
}

function LinkButton({ name, to, admin, icon, onClick }: LinkButtonProps) {
	const { me } = useMe();

	return (
		<ClearButton
			className={cn('hidden flex-row gap-2 rounded-lg p-2 hover:bg-blue-500', {
				flex: !admin || Users.isAdmin(me),
			})}
			active={window.location.pathname.endsWith(to)}
			title={name}
			onClick={() => onClick()}>
			{icon}
			{name}
		</ClearButton>
	);
}

function LoginButton({ onClick }: { onClick: () => void }) {
	return (
		<section className='flex flex-row items-center px-2'>
			<LoginIcon className='h-6 w-6' />
			<ClearButton className='flex flex-col rounded-lg p-2 dark:hover:bg-blue-500 dark:hover:text-white' title={i18n.t('login')} onClick={() => onClick()}>
				<Trans i18nKey='login' />
			</ClearButton>
		</section>
	);
}

function UserDisplay({ onClick }: { onClick: () => void }) {
	const { me, handleLogout } = useMe();

	if (!me) return <Fragment />;

	return (
		<div className='flex cursor-pointer flex-row items-center justify-between gap-2' onClick={() => onClick()}>
			<section className='flex flex-row items-center justify-center gap-2'>
				<UserAvatar className='h-12 w-12 rounded-xl' user={me} />
				<section className='flex h-full flex-col text-xl'>
					<p className='capitalize'>{me.name}</p>
					<UserRoleDisplay roles={me.role} />
				</section>
			</section>
			<ClearButton className='flex flex-row items-center justify-center gap-2 rounded-lg p-2 dark:hover:bg-blue-500 dark:hover:text-white' title={i18n.t('logout')} onClick={handleLogout}>
				<LogoutIcon className='h-6 w-6' />
			</ClearButton>
		</div>
	);
}
