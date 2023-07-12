import '../../styles.css';
import './UserPage.css';

import React, { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { API } from '../../API';
import UserData from '../../components/user/UserData';
import LoadingSpinner from '../../components/loader/LoadingSpinner';
import { PopupMessageContext } from '../../components/provider/PopupMessageProvider';
import i18n from '../../util/I18N';
import { Trans } from 'react-i18next';
import UserSchematicTab from './UserSchematicTab';

const tabs = ['Schematic', 'Map'];

export default function UserPage() {
	const { userId } = useParams();

	const [loading, setLoading] = React.useState(true);

	const [user, setUser] = React.useState<UserData>();

	const popup = useRef(useContext(PopupMessageContext));

	const [currentTab, setCurrentTab] = useState<string>(tabs[0]);

	useEffect(() => {
		API.REQUEST.get(`user/${userId}`) //
			.then((result) => setUser(result.data)) //
			.catch(() =>
				popup.current.addPopupMessage({
					message: i18n.t('user.load-fail'),
					duration: 5,
					type: 'error',
				}),
			)
			.finally(() => setLoading(false));
	}, [userId]);

	function renderTab(currentTab: string) {
		switch (currentTab) {
			case tabs[0]:
				if (user) return <UserSchematicTab user={user} />;
				return (
					<main className="flex-center h100p w100p">
						<Trans i18nKey="user.not-found" />
					</main>
				);

			case tabs[1]:
				return <>{currentTab}</>;

			case tabs[2]:
				return <>{currentTab}</>;

			default:
				return <>No tab</>;
		}
	}

	if (!userId)
		return (
			<main className="flex-center h100p w100p">
				<Trans i18nKey="user.invalid-id" />
			</main>
		);

	if (loading)
		return (
			<main className="flex-center h100p w100p">
				<LoadingSpinner />
			</main>
		);

	if (!user)
		return (
			<main className="flex-center h100p w100p">
				<Trans i18nKey="user.not-found" />
			</main>
		);

	return (
		<main className="user flex-column h100p w100p">
			<section className="user-card flex-row small-gap flex-nowrap">
				<img className="avatar-image" src={user.imageUrl} alt="avatar"></img>
				<section className="info-card small-gap small-padding">
					<span className="capitalize username">{user.name}</span>
					<span className="flex-row small-gap">
						{user.role.map((r, index) => (
							<span key={index} className="capitalize">
								{r}
							</span>
						))}
					</span>
				</section>
			</section>
			<div className="tab-card flex-center">
				<section className="grid-row small-gap small-padding">
					{tabs.map((name, index) => (
						<button className={currentTab === name ? 'button-active' : 'button'} key={index} type="button" onClick={() => setCurrentTab(name)}>
							{name}
						</button>
					))}
				</section>
			</div>
			{renderTab(currentTab)}
		</main>
	);
}
