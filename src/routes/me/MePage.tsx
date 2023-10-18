import React from 'react';

import { Navigate } from 'react-router-dom';
import { useMe } from 'src/context/MeProvider';
import { InfoIcon, MapIcon, PostIcon, SchematicIcon } from 'src/components/Icon';
import { Trans } from 'react-i18next';
import SwitchBar from 'src/components/SwitchBar';
import MeInfoTab from 'src/routes/me/MeInfoTab';
import SwitchName from 'src/components/SwitchName';
import User from 'src/data/User';
import UserSchematicTab from 'src/routes/user/UserSchematicTab';
import UserPostTab from 'src/routes/user/UserPostTab';
import MeMap from 'src/routes/me/MeMapUploadTab';

export default function MePage() {
	const { me } = useMe();

	if (!me) return <Navigate to='/login' />;

	return (
		<main className='flex h-full w-full flex-col px-4'>
			<MePanel me={me} />
		</main>
	);
}

function MePanel({ me }: { me: User }) {
	return (
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
					element: <UserSchematicTab user={me} />,
				},
				{
					id: 'map',
					name: (
						<SwitchName>
							<MapIcon className='h-6 w-6' />
							<Trans i18nKey='map' />
						</SwitchName>
					),
					element: <MeMap />,
				},
				{
					id: 'post',
					name: (
						<SwitchName>
							<PostIcon className='h-6 w-6' />
							<Trans i18nKey='post' />
						</SwitchName>
					),
					element: <UserPostTab user={me} />,
				},
			]}
		/>
	);
}
