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
import SwitchName from 'src/components/SwitchName';

export default function MePage() {
	const { me } = useMe();

	if (!me) return <Navigate to='/login' />;

	return (
		<main className='flex h-full w-full flex-col px-4'>
			<SwitchBar
				className='flex h-full w-full flex-col'
				elements={[
					{
						id: 'info',
						name: (
							<SwitchName>
								<InfoIcon className='h-6 w-6' />
								<Trans i18nKey='information' />
							</SwitchName>
						),
						element: <MeInfoTab me={me} />,
					},
					{
						id: 'schematic',
						name: (
							<SwitchName>
								<SchematicIcon className='h-6 w-6' />
								<Trans i18nKey='schematic' />
							</SwitchName>
						),
						element: <MeSchematicUploadTab />,
					},
					{
						id: 'map',
						name: (
							<SwitchName>
								<MapIcon className='h-6 w-6' />
								<Trans i18nKey='map' />
							</SwitchName>
						),
						element: <UserMapUploadTab />,
					},
					{
						id: 'post',
						name: (
							<SwitchName>
								<PostIcon className='h-6 w-6' />
								<Trans i18nKey='post' />
							</SwitchName>
						),
						element: <UserPostUploadTab />,
					},
				]}
			/>
		</main>
	);
}
