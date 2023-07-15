import './LogTab.css';

import React from 'react';
import { Trans } from 'react-i18next';
import Button from 'src/components/button/Button';
import ScrollToTopButton from 'src/components/button/ScrollToTopButton';
import IfTrueElse from 'src/components/common/IfTrueElse';
import LoadingSpinner from 'src/components/loader/LoadingSpinner';
import { LogData } from 'src/components/log/LogData';
import usePage from 'src/hooks/UsePage';

export default function LogTab() {
	const { pages, loadPage, loaderState } = usePage<LogData>('log/page');

	function buildLoadAndScrollButton() {
		return (
			<section className='grid-row small-gap'>
				<Button onClick={() => loadPage()}>
					<IfTrueElse
						condition={loaderState === 'more'} //
						whenTrue={<Trans i18nKey='load-more' />}
						whenFalse={<Trans i18nKey='no-more-log' />}
					/>
				</Button>
				<ScrollToTopButton containerId='log' />
			</section>
		);
	}

	return (
		<main id='log' className='log flex-column h100p w100p scroll-y'>
			<section className='flex-column medium-gap'>
				{pages.map((log) => (
					<LogCard key={log.id} log={log} />
				))}
			</section>
			<footer className='flex-center'>
				<IfTrueElse
					condition={loaderState === 'loading'}
					whenTrue={<LoadingSpinner />} //
					whenFalse={buildLoadAndScrollButton()}
				/>
			</footer>
		</main>
	);
}

interface LogCardProps {
	log: LogData;
}

function LogCard(props: LogCardProps) {
	return (
		<section className='log-card medium-padding'>
			<p>ID: {props.log.id}</p>
			<p>Environment: {props.log.environment}</p>
			<p>Time: {props.log.time}</p>
			<div>
				Message:
				<br />
				{props.log.message.split('\n').map((t, index) => (
					<p key={index}>
						{t}
						<br />
					</p>
				))}
			</div>
		</section>
	);
}
