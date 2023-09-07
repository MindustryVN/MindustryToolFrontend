import React, { useState } from 'react';
import Button from 'src/components/Button';
import VerifySchematicPage from 'src/routes/admin/verify/schematic/VerifySchematicPage';
import VerifyMapPage from 'src/routes/admin/verify/map/VerifyMapPage';
import VerifyPostPage from 'src/routes/admin/verify/post/VerifyPostPage';
import i18n from 'src/util/I18N';

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
		<main className='flex flex-row h-full w-full overflow-y-auto'>
			<section className='flex justify-center items-center'>
				<section className='tab-button-container grid grid-auto-column grid-flow-col w-fit gap-2 p-2'>
					{tabs.map((name, index) => (
						<Button
							title={i18n.t(name)}
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
