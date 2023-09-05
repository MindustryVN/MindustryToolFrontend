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

	if (loading) return <LoadingSpinner className='flex justify-center items-center h-full' />;

	if (!user)
		return (
			<MessageScreen>
				<Trans i18nKey='user-not-found' />
			</MessageScreen>
		);

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
						element: <UserInfoTab user={user} />,
					},
					{
						id: 'schematic',
						name: (
							<div className='flex flex-row justify-end items-center gap-1'>
								<SchematicIcon className='w-6 h-6' />
								<Trans i18nKey='schematic' />
							</div>
						),
						element: <UserSchematicTab user={user} />,
					},
					{
						id: 'map',
						name: (
							<div className='flex flex-row justify-end items-center gap-1'>
								<MapIcon className='w-6 h-6' />
								<Trans i18nKey='map' />
							</div>
						),
						element: <UserMapTab user={user} />,
					},
					{
						id: 'post',
						name: (
							<div className='flex flex-row justify-end items-center gap-1'>
								<PostIcon className='w-6 h-6' />
								<Trans i18nKey='post' />
							</div>
						),
						element: <UserPostTab user={user} />,
					},
				]}
			/>
		</main>
	);
}
