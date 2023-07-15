import './AdminPage.css';
import 'src/styles.css';

import React, { useState } from 'react';
import VerifySchematicPage from './VerifySchematicTab';
import Button from 'src/components/button/Button';

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
		<main id="admin" className="flex-column h100p w100p scroll-y">
			<div className="flex-center">
				<section className="tab-button-container grid-row small-gap small-padding">
					{tabs.map((name, index) => (
						<Button active={currentTab === name} key={index} onClick={() => setCurrentTab(name)}>
							{name}
						</Button>
					))}
				</section>
			</div>
			{renderTab(currentTab)}
		</main>
	);
}
