import React from 'react';
import LoadUserName from 'src/components/LoadUserName';
import { Trans } from 'react-i18next';

export default function InfoPage() {
	return (
		<main className='flex justify-center items-center h-full w-full p-4'>
			<section className='grid grid-cols-2 bg-slate-950 p-2 rounded-lg gap-4'>
				<p className='flex flex-row gap-2 whitespace-nowrap'>
					<Trans i18nKey='page-owner' />
				</p>
				<LoadUserName userId='64b63239e53d0c354d505733' />
				<p className='flex flex-row gap-2 whitespace-nowrap'>
					<Trans i18nKey='admin' />
				</p>
				<div className='grid'>
					<LoadUserName userId='64b6def5fa35080d51928849' />
					<LoadUserName userId='64b8c74b2ab2c664a63d9f0d' />
					<LoadUserName userId='64ba2279c92ba71c46dc7355' />
				</div>
				<p className='flex flex-row gap-2 whitespace-nowrap'>
					<Trans i18nKey='contributor' />
				</p>
				<LoadUserName userId='64b7f3cf830ef61869872548' />
			</section>
		</main>
	);
}
