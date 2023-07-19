import './NotificationTab.css';
import 'src/styles.css';

import React from 'react';
import ClearIconButton from 'src/components/button/ClearIconButton';
import useModel from 'src/hooks/UseModel';
import useNotification from 'src/hooks/UseNotification';
import Notification from 'src/data/Notification';
import IfTrueElse from 'src/components/common/IfTrueElse';
import Loading from 'src/components/loader/Loading';
import LoadingSpinner from 'src/components/loader/LoadingSpinner';
import { Trans } from 'react-i18next';

export default function NotificationTab() {
	const { model, setVisibility } = useModel();

	const { pages, loadPage, reloadPage, loaderState } = useNotification();

	return (
		<section>
			<ClearIconButton
				className='icon w2rem h2rem'
				title='notification'
				icon='/assets/icons/chat.png' //
				onClick={() => setVisibility((prev) => !prev)}
			/>
			{model(
				<section className='flex-center'>
					<IfTrueElse
						condition={loaderState === 'loading'} //
						whenTrue={<LoadingSpinner />}
						whenFalse={<NotificationCard pages={pages} />}
					/>
					,
				</section>,
			)}
		</section>
	);
}

interface NotificationCardProps {
	pages: Array<Notification>;
}

function NotificationCard(props: NotificationCardProps) {
	if (props.pages.length === 0) return <p className='massive-padding'>Còn cái nịt</p>;

	return (
		<section className='h100p w100p flex-column massive-padding'>
			{props.pages.map((notification) => (
				<section className='notification medium-padding border-box'>
					<p>{notification.message}</p>
					<p>
						<Trans i18nKey='date' /> : {notification.time}
					</p>
				</section>
			))}
		</section>
	);
}
