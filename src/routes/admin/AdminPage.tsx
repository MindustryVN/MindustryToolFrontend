import './AdminPage.css';
import 'src/styles.css';

import React, { useState } from 'react';
import VerifyPage from 'src/routes/admin/verify/VerifyPage';
import { Trans } from 'react-i18next';

const tabs = ['verify', 'report', 'log'];

export default function AdminPage() {
	const [selectedTab, setSelectedTab] = useState(tabs[0]);

	function renderTab() {
		switch (selectedTab) {
			case 'verify':
				return <VerifyPage />;
		}
	}

	return (
		<main id='admin' className='flex-column h100p w100p small-gap small-padding border-box'>
			<section className='grid-row tab-button-container'>
				{tabs.map((k, index) => (
					<button
						key={index}
						title={k}
						type='button'
						className={k === selectedTab ? 'tab-button-selected' : 'tab-button'} //
						onClick={() => setSelectedTab(k)}>
						<Trans i18nKey={k} />
					</button>
				))}
			</section>
			{renderTab()}
		</main>
	);
}
