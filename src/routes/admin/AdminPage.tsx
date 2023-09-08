import React from 'react';
import { Trans } from 'react-i18next';
import SwitchBar from 'src/components/SwitchBar';
import SwitchName from 'src/components/SwitchName';
import VerifyMapPage from 'src/routes/admin/verify/VerifyMapPage';
import VerifyPostPage from 'src/routes/admin/verify/VerifyPostPage';
import VerifySchematicPage from 'src/routes/admin/verify/VerifySchematicPage';

export default function AdminPage() {
	return (
		<main id='admin' className='box-border flex h-full w-full flex-row gap-2 p-2'>
			<SwitchBar
				className='h-full w-full'
				elements={[
					{
						id: 'verify-schematic',
						name: (
							<SwitchName>
								<Trans i18nKey='verify-schematic' />
							</SwitchName>
						),
						element: <VerifySchematicPage />,
					},
					{
						id: 'verify-map',
						name: (
							<SwitchName>
								<Trans i18nKey='verify-map' />
							</SwitchName>
						),
						element: <VerifyMapPage />,
					},
					{
						id: 'verify-post',
						name: (
							<SwitchName>
								<Trans i18nKey='verify-post' />
							</SwitchName>
						),
						element: <VerifyPostPage />,
					},
				]}
			/>
		</main>
	);
}
