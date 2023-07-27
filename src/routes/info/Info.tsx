import 'src/styles.css';

import React from 'react';
import LoadUserName from 'src/components/user/LoadUserName';
import { Trans } from 'react-i18next';

export default function InfoPage() {
	return (
		<main className='flex-column h100p w100p center medium-gap'>
			<span>
				<Trans i18nKey='page-owner' />: <LoadUserName userId='64b63239e53d0c354d505733' />
			</span>
			<span>
				<Trans i18nKey='admin' />: <LoadUserName userId='64b6def5fa35080d51928849' />
			</span>
			<span>
				<Trans i18nKey='contributor' />: <LoadUserName userId='64b7f3cf830ef61869872548' />
			</span>
		</main>
	);
}
