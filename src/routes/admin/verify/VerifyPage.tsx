import 'src/styles.css';

import React, { useState } from 'react';
import Button from 'src/components/button/Button';
import VerifySchematicPage from 'src/routes/admin/verify/schematic/VerifySchematicPage';
import VerifyMapPage from 'src/routes/admin/verify/map/VerifyMapPage';
import VerifyPostPage from 'src/routes/admin/verify/post/VerifyPostPage';

const tabs = ['Schematic', 'Map', 'Post'];

export default function VerifyPage() {
	const [currentTab, setCurrentTab] = useState<string>(tabs[0]);

	function renderTab(currentTab: string) {
		switch (currentTab) {
			case tabs[0]:
				return <VerifySchematicPage />;

			case tabs[1]:
				return <VerifyMapPage />;

			case tabs[2]:
				return <VerifyPostPage />;

			default:
				return <>Error</>;
		}
	}

	return (
		<main className='flex-column h100p w100p scroll-y'>
			<section className='flex-center'>
				<section className='tab-button-container grid-row small-gap small-padding'>
					{tabs.map((name, index) => (
						<Button
							active={currentTab === name} //
							key={index}
							onClick={() => setCurrentTab(name)}>
							{name}
						</Button>
					))}
				</section>
			</section>
			{renderTab(currentTab)}
		</main>
	);
}
