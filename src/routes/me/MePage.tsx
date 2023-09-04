import './MePage.css';

import React, { useState } from 'react';

import { Navigate } from 'react-router-dom';
import { Trans } from 'react-i18next';
import { useMe } from 'src/context/MeProvider';
import Button from 'src/components/Button';
import UserSchematicUploadTab from 'src/routes/me/MeSchematicUploadTab';
import UserMapUploadTab from 'src/routes/me/MeMapUploadTab';
import UserPostUploadTab from 'src/routes/me/MePostUploadTab';
import i18n from 'src/util/I18N';

const tabs = ['Schematic', 'Map', 'Post'];

export default function MePage() {
	const { me, handleLogout } = useMe();
	const [currentTab, setCurrentTab] = useState<string>(tabs[0]);

	if (!me) return <Navigate to='/login' />;

	function renderTab(currentTab: string) {
		switch (currentTab) {
			case tabs[0]:
				return <UserSchematicUploadTab />;

			case tabs[1]:
				return <UserMapUploadTab />;

			case tabs[2]:
				return <UserPostUploadTab />;

			default:
				return <>Oh no</>;
		}
	}

	return (
		<main className='flex flex-row h-full w-full overflow-y-auto medium-padding box-border'>
			<section className='flex flex-row gap-2 align-start'>
				<section className='flex flex-row gap-2'>
					<img className='avatar-image' src={me.imageUrl} alt='avatar'></img>
					<span className='username capitalize'>{me.name}</span>
				</section>
				<Button className='button' title={i18n.t('logout')} onClick={() => handleLogout()}>
					<Trans i18nKey='logout' />
				</Button>
			</section>
			<section className='flex justify-center items-center'>
				<section className='grid grid-auto-column grid-flow-col w-fit gap-2 p-2'>
					{tabs.map((name, index) => (
						<Button
							className={currentTab === name ? 'button-active' : 'button'}
							title={i18n.t(name)}
							key={index} //
							onClick={() => setCurrentTab(name)}>
							{name}
						</Button>
					))}
				</section>
			</section>
			{renderTab(currentTab)}
		</main>
	);
}
