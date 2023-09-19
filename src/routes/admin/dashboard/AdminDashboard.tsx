import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { API } from 'src/API';
import { Metric } from 'src/data/Metric';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend } from 'chart.js';
import i18n from 'src/util/I18N';
import LoadingSpinner from 'src/components/LoadingSpinner';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend);

export default function AdminDashboard() {
	const [dailyUser, setDailyUser] = useState<Metric[]>([]);
	const [loggedDailyUser, setLoggedDailyUser] = useState<Metric[]>([]);

	let maxLength = dailyUser.length > loggedDailyUser.length ? dailyUser.length : loggedDailyUser.length;

	let fixedDailyUser: Metric[] = [
		...Array(maxLength - dailyUser.length).fill({
			time: '0',
			value: 0,
		}),
		...dailyUser,
	];

	let fixedLoggedDailyUser: Metric[] = [
		...Array(maxLength - loggedDailyUser.length).fill({
			time: '0',
			value: 0,
		}),
		...loggedDailyUser,
	];

	let timeLabel = dailyUser.length > loggedDailyUser.length ? dailyUser.map((d) => d.time) : loggedDailyUser.map((d) => d.time);

	useEffect(() => {
		let start = new Date();
		start.setDate(new Date().getDate() - 30);
		let end = new Date();

		API.getMetric(start, end, 'daily_user')
			.then((result) => setDailyUser(result.data))
			.catch((error) => console.log(error));

		API.getMetric(start, end, 'logged_daily_user')
			.then((result) => setLoggedDailyUser(result.data))
			.catch((error) => console.log(error));
	}, []);

	if (dailyUser.length === 0) return <LoadingSpinner className='flex w-full items-center justify-center' />;

	return (
		<main className='h-full w-full overflow-y-auto p-12'>
			<section className='grid grid-cols-[repeat(auto-fill,min(500px,80vw))]'>
				<div className='rounded-lg bg-slate-600 bg-opacity-40 p-2'>
					<Line
						className='relative h-full w-full whitespace-nowrap'
						options={{ responsive: true, maintainAspectRatio: true }}
						data={{
							labels: timeLabel,
							datasets: [
								{
									label: i18n.t('daily-user').toString(),
									fill: true,
									borderColor: 'rgb(53, 162, 235, 0.5)',
									backgroundColor: 'rgb(53, 162, 235, 0.5)',
									data: fixedDailyUser.map((d) => d.value),
								},
								{
									label: i18n.t('logged-daily-user').toString(),
									fill: true,
									borderColor: 'rgb(34, 197, 94, 0.5)',
									backgroundColor: 'rgb(34, 197, 94, 0.5)',
									data: fixedLoggedDailyUser.map((d) => d.value),
								},
							],
						}}
					/>
				</div>
			</section>
		</main>
	);
}
