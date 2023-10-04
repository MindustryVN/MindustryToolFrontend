import React, { useState } from 'react';
import { API } from 'src/API';
import { Log } from 'src/data/Log';

import LoadingSpinner from 'src/components/LoadingSpinner';
import useInfinitePage from 'src/hooks/UseInfinitePage';
import { usePopup } from 'src/context/PopupMessageProvider';
import ClearIconButton from 'src/components/ClearIconButton';
import DateDisplay from 'src/components/Date';
import useQuery from 'src/hooks/UseQuery';
import OptionBox from 'src/components/OptionBox';
import InfiniteScroll from 'src/components/InfiniteScroll';

export default function LogPage() {
	const [contentType, setContentType] = useState('system');
	const logTypes = useQuery<string[]>('log', []);

	if (!logTypes.data) return <LoadingSpinner />;

	return (
		<section className='flex h-full w-full flex-col gap-2 overflow-y-auto overflow-x-hidden'>
			<OptionBox
				className='m-2 h-8 flex-shrink-0 bg-slate-900'
				items={logTypes.data}
				defaultValue='system'
				mapper={(item, index) => <span className='capitalize' key={index} children={item} />}
				onChoose={(item) => setContentType(item)}
			/>
			<LogContainer contentType={contentType} />
		</section>
	);
}

interface LogContainerProps {
	contentType: string;
}

function LogContainer({ contentType }: LogContainerProps) {
	const usePage = useInfinitePage<Log>(`log/${contentType}`, 20);
	const { addPopup } = usePopup();

	function handleDeleteLog(id: string) {
		API.deleteLog(contentType, id) //
			.then(() => addPopup('delete-success', 5, 'info'))
			.catch(() => addPopup('delete-fail', 5, 'warning'))
			.finally(() => usePage.filter((l) => l.id !== id));
	}

	return (
		<section className='flex h-full w-full flex-col'>
			<InfiniteScroll id='log' className='flex flex-col gap-2' infinitePage={usePage} mapper={(v: Log) => <LogCard key={v.id} log={v} handleDeleteLog={handleDeleteLog} />} />
			<footer className='flex w-full items-center justify-center'></footer>
		</section>
	);
}

interface LogCardProps {
	log: Log;
	handleDeleteLog: (id: string) => void;
}

function LogCard({ log, handleDeleteLog }: LogCardProps) {
	const content: string[] = log.content.split('\n');
	let detail: string[] = content.slice(1);

	if (detail && detail.length > 0)
		return (
			<details className='relative bg-slate-900 p-2'>
				<summary>
					<LogContent log={log} handleDeleteLog={handleDeleteLog} />
				</summary>
				<LogDetail detail={detail} />
			</details>
		);

	return (
		<div className='relative bg-slate-900 p-2'>
			<LogContent log={log} handleDeleteLog={handleDeleteLog} />
		</div>
	);
}

function LogContent({ log, handleDeleteLog }: LogCardProps) {
	const content: string[] = log.content.split('\n');
	const header = content[0];

	return (
		<>
			<p>ID: {log.id}</p>
			<p>Environment: {log.environment}</p>
			{log.userId && <p>User ID: {log.userId}</p>}
			{log.ip && <p>IP: {log.ip}</p>}
			{log.requestUrl && <p>Request URL: {log.requestUrl}</p>}
			<p>
				Time: <DateDisplay time={log.time} />
			</p>
			<p>Message: {header}</p>
			<ClearIconButton
				className='absolute right-0 top-0 m-2' //
				icon='/assets/icons/trash-16.png'
				title='delete'
				onClick={() => handleDeleteLog(log.id)}
			/>
		</>
	);
}

function LogDetail({ detail }: { detail: string[] }) {
	return (
		<div>
			Detail:
			<div className='p-2'>
				{detail.map((t, index) => (
					<p key={index}>
						{t}
						<br />
					</p>
				))}
			</div>
		</div>
	);
}
