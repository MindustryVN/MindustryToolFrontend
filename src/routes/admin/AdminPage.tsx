import './AdminPage.css';
import '../../styles.css';

import React, { useState } from 'react';
import VerifySchematicPage from './VerifySchematicTab';

const tabs = ['Verify Schematic', 'Verify Map', 'Report'];

export default function Admin() {
	const [currentTab, setCurrentTab] = useState<string>(tabs[0]);

	function renderTab(currentTab: string) {
		switch (currentTab) {
			case tabs[0]:
				return <VerifySchematicPage />;

			case tabs[1]:
				return <>{currentTab}</>;

			case tabs[2]:
				return <>{currentTab}</>;

			default:
				return <>No tab</>;
		}
	}

	return (
		<main id='admin' className='admin flex-column h100p w100p'>
			<div className='flex-center'>
				<section className='tab-button-container grid-row small-gap small-padding'>
					{tabs.map((name, index) => (
						<button className={currentTab === name ? 'button-active' : 'button'} key={index} type='button' onClick={() => setCurrentTab(name)}>
							{name}
						</button>
					))}
				</section>
			</div>
			{renderTab(currentTab)}
		</main>
	);
}
