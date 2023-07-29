import './UploadPage.css';
import 'src/styles.css';

import React, { useState } from 'react';
import { Trans } from 'react-i18next';
import UploadMapPage from 'src/routes/upload/UploadMapPage';
import UploadSchematicPage from 'src/routes/upload/UploadSchematicPage';

const tabs = ['schematic', 'map'];

export default function UploadPage() {
	const [selectedTab, setSelectedTab] = useState(tabs[0]);

	function renderTab() {
		switch (selectedTab) {
			case tabs[0]:
				return <UploadSchematicPage />;

			case tabs[1]:
				return <UploadMapPage />;
		}
	}
	return (
		<main className='flex-column h100p w100p small-gap small-padding border-box'>
			<section className='grid-row tab-button-container'>
				{tabs.map((name, index) => (
					<button
						key={index}
						title={name}
						type='button'
						className={name === selectedTab ? 'tab-button-selected' : 'tab-button'} //
						onClick={() => setSelectedTab(name)}>
						<Trans i18nKey={name} />
					</button>
				))}
			</section>
			{renderTab()}
		</main>
	);
}
