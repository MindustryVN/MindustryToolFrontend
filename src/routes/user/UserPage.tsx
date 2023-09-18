import React, { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { API } from 'src/API';
import User from 'src/data/User';
import LoadingSpinner from 'src/components/LoadingSpinner';
import { PopupMessageContext } from 'src/context/PopupMessageProvider';
import i18n from 'src/util/I18N';
import { Trans } from 'react-i18next';
import MessageScreen from 'src/components/MessageScreen';
import SwitchBar from 'src/components/SwitchBar';
import UserSchematicTab from 'src/routes/user/UserSchematicTab';
import UserMapTab from 'src/routes/user/UserMapTab';
import UserPostTab from 'src/routes/user/UserPostTab';
import UserInfoTab from 'src/routes/user/UserInfoTab';
import { InfoIcon, MapIcon, PostIcon, SchematicIcon } from 'src/components/Icon';
import SwitchName from 'src/components/SwitchName';

export default function UserPage() {
	const { userId } = useParams();

	const [loading, setLoading] = React.useState(true);

	const [user, setUser] = React.useState<User>();

	const popup = useContext(PopupMessageContext);

	useEffect(() => {
		if (userId)
			API.getUser(userId) //
				.then((result) => setUser(result.data)) //
				.catch(() => popup.addPopup(i18n.t('user.load-fail'), 5, 'error'))
				.finally(() => setLoading(false));
	}, [userId, popup]);

	if (!userId)
		return (
			<MessageScreen>
				<Trans i18nKey='user-invalid-id' />
			</MessageScreen>
		);

	if (loading) return <LoadingSpinner className='flex h-full items-center justify-center' />;

	if (!user)
		return (
			<MessageScreen>
				<Trans i18nKey='user-not-found' />
			</MessageScreen>
		);

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
						element: <UserInfoTab user={user} />,
					},
					{
						id: 'schematic',
						name: (
							<SwitchName>
								<SchematicIcon className='h-6 w-6' />
								<Trans i18nKey='schematic' />
							</SwitchName>
						),
						element: <UserSchematicTab user={user} />,
					},
					{
						id: 'map',
						name: (
							<SwitchName>
								<MapIcon className='h-6 w-6' />
								<Trans i18nKey='map' />
							</SwitchName>
						),
						element: <UserMapTab user={user} />,
					},
					{
						id: 'post',
						name: (
							<SwitchName>
								<PostIcon className='h-6 w-6' />
								<Trans i18nKey='post' />
							</SwitchName>
						),
						element: <UserPostTab user={user} />,
					},
				]}
			/>
		</main>
	);
}
