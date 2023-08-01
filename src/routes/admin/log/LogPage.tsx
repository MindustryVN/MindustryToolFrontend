import './LogPage.css';
import 'src/styles.css';

import React, { useState } from 'react';
import { Trans } from 'react-i18next';
import { API } from 'src/API';
import { Log } from 'src/data/Log';

import Button from 'src/components/button/Button';
import ScrollToTopButton from 'src/components/button/ScrollToTopButton';
import IfTrueElse from 'src/components/common/IfTrueElse';
import LoadingSpinner from 'src/components/loader/LoadingSpinner';
import usePage from 'src/hooks/UsePage';
import usePopup from 'src/hooks/UsePopup';
import ClearIconButton from 'src/components/button/ClearIconButton';
import DateDisplay from 'src/components/common/Date';

export default function LogPage() {
	const [contentType, setContentType] = useState('system');
	const { pages, loadPage, reloadPage, isLoading, hasMore } = usePage<Log>(`log/${contentType}`, 20);
	const { addPopup } = usePopup();

	function handleDeleteLog(id: string) {
		API.deleteLog(contentType, id) //
			.then(() => addPopup('delete-success', 5, 'info'))
			.catch(() => addPopup('delete-fail', 5, 'warning'))
			.finally(() => reloadPage());
	}
	return (
		<main id='log' className='log flex-column h100p w100p scroll-y small-gap'>
			<section className='grid-row small-gap'>
				{['system', 'api'].map((item, index) => (
					<Button key={index} active={item === contentType} onClick={() => setContentType(item)}>
						{item}
					</Button>
				))}
			</section>
			<section className='flex-column medium-gap'>
				{pages.map((log) => (
					<LogCard key={log.id} log={log} handleDeleteLog={handleDeleteLog} />
				))}
			</section>
			<footer className='flex-center'>
				<IfTrueElse
					condition={isLoading}
					whenTrue={<LoadingSpinner />} //
					whenFalse={
						<Button onClick={() => loadPage()}>
							<IfTrueElse
								condition={hasMore} //
								whenTrue={<Trans i18nKey='load-more' />}
								whenFalse={<Trans i18nKey='no-more' />}
							/>
						</Button>
					}
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
					className='absolute top right small-margin ' //
					icon='/assets/icons/trash-16.png'
					title='delete'
					onClick={() => props.handleDeleteLog(props.log.id)}
				/>
			</summary>
			<div>
				Detail:
				<div className='medium-padding border-box'>
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
