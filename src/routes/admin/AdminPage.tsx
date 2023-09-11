import React, { useEffect, useState } from 'react';
import { Trans } from 'react-i18next';
import { API } from 'src/API';
import SwitchBar from 'src/components/SwitchBar';
import SwitchName from 'src/components/SwitchName';
import AdminDashboard from 'src/routes/admin/dashboard/AdminDashboard';
import LogPage from 'src/routes/admin/log/LogPage';
import VerifyMapPage from 'src/routes/admin/verify/VerifyMapPage';
import VerifyPostPage from 'src/routes/admin/verify/VerifyPostPage';
import VerifySchematicPage from 'src/routes/admin/verify/VerifySchematicPage';
import { cn } from 'src/util/Utils';

export default function AdminPage() {
	const [totalSchematic, setTotalSchematic] = useState(0);
	const [totalMap, setTotalMap] = useState(0);
	const [totalPost, setTotalPost] = useState(0);

	useEffect(() => {
		API.getTotalSchematicUpload()
			.then((result) => setTotalSchematic(result.data))
			.catch(() => console.log('Error fletching total schematic'));

		API.getTotalMapUpload()
			.then((result) => setTotalMap(result.data))
			.catch(() => console.log('Error fletching total map'));

		API.getTotalPostUpload()
			.then((result) => setTotalPost(result.data))
			.catch(() => console.log('Error fletching total map'));
	}, []);

	return (
		<div id='admin' className='box-border flex h-full w-full flex-row gap-2 p-2'>
			<SwitchBar
				className='h-full w-full'
				elements={[
					{
						id: 'dashboard',
						name: (
							<SwitchName>
								<Trans i18nKey='dashboard' />
							</SwitchName>
						),
						element: <AdminDashboard />,
					},
					{
						id: 'verify-schematic',
						name: (
							<SwitchName className=''>
								<Trans i18nKey='verify-schematic' />
								<span
									className={cn('rounded-sm bg-green-600 px-2 text-xs text-white', {
										hidden: totalSchematic <= 0,
									})}>
									{totalSchematic}
								</span>
							</SwitchName>
						),
						element: <VerifySchematicPage />,
					},
					{
						id: 'verify-map',
						name: (
							<SwitchName>
								<Trans i18nKey='verify-map' />
								<span
									className={cn('rounded-sm bg-green-600 px-2 text-xs text-white', {
										hidden: totalMap <= 0,
									})}>
									{totalMap}
								</span>
							</SwitchName>
						),
						element: <VerifyMapPage />,
					},
					{
						id: 'verify-post',
						name: (
							<SwitchName>
								<Trans i18nKey='verify-post' />
								<span
									className={cn('rounded-sm bg-green-600 px-2 text-xs text-white', {
										hidden: totalPost <= 0,
									})}>
									{totalPost}
								</span>
							</SwitchName>
						),
						element: <VerifyPostPage />,
					},
					{
						id: 'log',
						name: (
							<SwitchName>
								<Trans i18nKey='log' />
							</SwitchName>
						),
						element: <LogPage />,
					},
				]}
			/>
		</div>
	);
}
