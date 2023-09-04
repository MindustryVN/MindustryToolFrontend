import './LogPage.css';

import React, { useState } from 'react';
import { API } from 'src/API';
import { Log } from 'src/data/Log';

import Button from 'src/components/Button';
import ScrollToTopButton from 'src/components/ScrollToTopButton';
import LoadingSpinner from 'src/components/LoadingSpinner';
import useInfinitePage from 'src/hooks/UseInfinitePage';
import { usePopup } from 'src/context/PopupMessageProvider';
import ClearIconButton from 'src/components/ClearIconButton';
import DateDisplay from 'src/components/Date';
import useInfiniteScroll from 'src/hooks/UseInfiniteScroll';
import IfTrue from 'src/components/IfTrue';
import useQuery from 'src/hooks/UseQuery';
import i18n from 'src/util/I18N';

export default function LogPage() {
	const [contentType, setContentType] = useState('system');
	const { addPopup } = usePopup();

	const usePage = useInfinitePage<Log>(`log/${contentType}`, 20);
	const { pages, isLoading } = useInfiniteScroll(usePage, (v: Log) => <LogCard key={v.id} log={v} handleDeleteLog={handleDeleteLog} />);

	const logTypes = useQuery<string[]>('log', []);

	function handleDeleteLog(id: string) {
		API.deleteLog(contentType, id) //
			.then(() => addPopup('delete-success', 5, 'info'))
			.catch(() => addPopup('delete-fail', 5, 'warning'))
			.finally(() => usePage.filter((l) => l.id !== id));
	}

	if (!logTypes.data) return <LoadingSpinner />;

	return (
		<main className='flex flex-row h-full w-full overflow-y-auto gap-1'>
			<section className='grid grid-auto-column grid-flow-col w-fit gap-2'>
				{logTypes.data.map((item, index) => (
					<Button
						title={i18n.t(item)}
						key={index}
						active={item === contentType} //
						onClick={() => setContentType(item)}>
						{item}
					</Button>
				))}
			</section>
			<section id='log' className='flex flex-row gap-2 ' children={pages} />
			<footer className='flex justify-center items-center'>
				<IfTrue
					condition={isLoading}
					whenTrue={<LoadingSpinner />} //
				/>
				<ScrollToTopButton containerId='log' />
			</footer>
		</main>
	);
}

interface LogCardProps {
	log: Log;
	handleDeleteLog: (id: string) => void;
}

function LogCard(props: LogCardProps) {
	const content: string[] = props.log.content.split('\n');
	const header = content[0];
	let detail: string[] = content.slice(1);
	detail = detail ? detail : ['No content'];

	return (
		<details className='log-card relative medium-padding'>
			<summary>
				<p>ID: {props.log.id}</p>
				<p>Environment: {props.log.environment}</p>
				<p>
					Time: <DateDisplay time={props.log.time} />
				</p>
				<p>Message: {header}</p>
				<ClearIconButton
					className='absolute top-0 right small-margin ' //
					icon='/assets/icons/trash-16.png'
					title='delete'
					onClick={() => props.handleDeleteLog(props.log.id)}
				/>
			</summary>
			<div>
				Detail:
				<div className='medium-padding box-border'>
					{detail.map((t, index) => (
						<p key={index}>
							{t}
							<br />
						</p>
					))}
				</div>
			</div>
		</details>
	);
}
