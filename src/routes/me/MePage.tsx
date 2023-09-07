import React from 'react';

import { Navigate } from 'react-router-dom';
import { useMe } from 'src/context/MeProvider';
import { InfoIcon, MapIcon, PostIcon, SchematicIcon } from 'src/components/Icon';
import { Trans } from 'react-i18next';
import SwitchBar from 'src/components/SwitchBar';
import UserMapUploadTab from 'src/routes/me/MeMapUploadTab';
import UserPostUploadTab from 'src/routes/me/MePostUploadTab';
import MeInfoTab from 'src/routes/me/MeInfoTab';
import MeSchematicUploadTab from 'src/routes/me/MeSchematicUploadTab';

export default function MePage() {
	const { me } = useMe();

	if (!me) return <Navigate to='/login' />;

	return (
		<main className='flex flex-col w-full h-full'>
			<SwitchBar
				className='flex flex-col w-full h-full'
				elements={[
					{
						id: 'info',
						name: (
							<div className='flex flex-row justify-end items-center gap-1'>
								<InfoIcon className='w-6 h-6' />
								<Trans i18nKey='information' />
							</div>
						),
						element: <MeInfoTab me={me} />,
					},
					{
						id: 'schematic',
						name: (
							<div className='flex flex-row justify-end items-center gap-1'>
								<SchematicIcon className='w-6 h-6' />
								<Trans i18nKey='schematic' />
							</div>
						),
						element: <MeSchematicUploadTab />,
					},
					{
						id: 'map',
						name: (
							<div className='flex flex-row justify-end items-center gap-1'>
								<MapIcon className='w-6 h-6' />
								<Trans i18nKey='map' />
							</div>
						),
						element: <UserMapUploadTab />,
					},
					{
						id: 'post',
						name: (
							<div className='flex flex-row justify-end items-center gap-1'>
								<PostIcon className='w-6 h-6' />
								<Trans i18nKey='post' />
							</div>
						),
						element: <UserPostUploadTab />,
					},
				]}
			/>
		</main>
	);
}
