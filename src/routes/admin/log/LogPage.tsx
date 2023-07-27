import './LogPage.css';
import 'src/styles.css';

import React from 'react';
import { Trans } from 'react-i18next';
import { API } from 'src/API';
import { LogData } from 'src/components/log/LogData';

import Button from 'src/components/button/Button';
import ScrollToTopButton from 'src/components/button/ScrollToTopButton';
import IfTrueElse from 'src/components/common/IfTrueElse';
import LoadingSpinner from 'src/components/loader/LoadingSpinner';
import usePage from 'src/hooks/UsePage';
import usePopup from 'src/hooks/UsePopup';
import ClearIconButton from 'src/components/button/ClearIconButton';

export default function LogPage() {
	const contentType = 'system';
	const { pages, loadPage, reloadPage, isLoading, hasMore } = usePage<LogData>(`log/${contentType}`, 20);
	const { addPopup } = usePopup();

	function buildLoadAndScrollButton() {
		return (
			<section className='grid-row small-gap'>
				<Button onClick={() => loadPage()}>
					<IfTrueElse
						condition={hasMore} //
						whenTrue={<Trans i18nKey='load-more' />}
						whenFalse={<Trans i18nKey='no-more' />}
					/>
				</Button>
				<ScrollToTopButton containerId='log' />
			</section>
		);
	}

	function handleDeleteLog(id: string) {
		API.deleteLog(contentType, id) //
			.then(() => {
				addPopup('delete-success', 5, 'info');
				reloadPage();
			})
			.catch(() => addPopup('delete-fail', 5, 'warning'));
	}
	return (
		<main id='log' className='log flex-column h100p w100p scroll-y'>
			<section className='flex-column medium-gap'>
				{pages.map((log) => (
					<LogCard key={log.id} log={log} handleDeleteLog={handleDeleteLog} />
				))}
			</section>
			<footer className='flex-center'>
				<IfTrueElse
					condition={isLoading}
					whenTrue={<LoadingSpinner />} //
					whenFalse={buildLoadAndScrollButton()}
				/>
			</footer>
		</main>
	);
}

interface LogCardProps {
	log: LogData;
	handleDeleteLog: (id: string) => void;
}

function LogCard(props: LogCardProps) {
	const message: string[] = props.log.message.split('\n');
	const header = message[0];
	let detail: string[] = message.slice(1);
	detail = detail ? detail : ['No content'];

	return (
		<details className='log-card relative medium-padding'>
			<summary>
				<p>ID: {props.log.id}</p>
				<p>Environment: {props.log.environment}</p>
				<p>Time: {new Date(props.log.time).toLocaleString('en-GB')}</p>
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
