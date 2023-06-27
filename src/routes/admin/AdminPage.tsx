import './AdminPage.css';
import '../../styles.css';

import React, { useState } from 'react';
import { VerifySchematicPage } from './VerifySchematicPage';
import UserInfo, { isAdmin } from '../user/UserInfo';

const tabs = ['Verify Schematic', 'Verify Map', 'Report'];

const Admin = ({ user }: { user: UserInfo | undefined }) => {
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
		<div className='admin'>
			<div className='flexbox-center'>
				<section className='tab-button-container grid-row small-gap dark-background light-border small-padding'>
					{tabs.map((name, index) => (
						<button className={currentTab === name ? 'button-selected' : 'button-normal'} key={index} type='button' onClick={() => setCurrentTab(name)}>
							{name}
						</button>
					))}
				</section>
			</div>
			<div className='flexbox-center'>{renderTab(currentTab)}</div>
		</div>
	);
};

export default Admin;
