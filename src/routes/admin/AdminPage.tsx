import './AdminPage.css';
import '../../styles.css';

import React, { useState } from 'react';
import { VerifySchematicPage } from './VerifySchematicPage';

const tabs = ['Verify Schematic', 'Verify Map', 'Report'];

const Admin = () => {

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
		<main className='admin'>
			<div className='flexbox-center'>
				<section className='tab-button-container grid-row small-gap  light-border small-padding'>
					{tabs.map((name, index) => (
						<button className={currentTab === name ? 'button-active' : 'button'} key={index} type='button' onClick={() => setCurrentTab(name)}>
							{name}
						</button>
					))}
				</section>
			</div>
			<section className='flexbox-center'>{renderTab(currentTab)}</section>
		</main>
	);
};

export default Admin;
