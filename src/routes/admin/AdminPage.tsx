import './AdminPage.css';
import '../../styles.css';

import React, { useState } from 'react';
import { VerifySchematicPage } from './VerifySchematicPage';

const tabs = ['Verify Schematic', 'Verify Map', 'Report'];

export default function Admin() {
	const [currentTab, setCurrentTab] = useState<string>(tabs[0]);

	function renderTab(currentTab: string) {
		switch (currentTab) {
			case tabs[0]:
				return <VerifySchematicPage />;

			case tabs[1]:
				return <div>{currentTab}</div>;

			case tabs[2]:
				return <div>{currentTab}</div>;

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
			<section className='flex-center h100p w100p'>{renderTab(currentTab)}</section>
		</main>
	);
}
