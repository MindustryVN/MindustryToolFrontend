import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { API } from 'src/API';
import { Metric } from 'src/data/Metric';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend } from 'chart.js';
import i18n from 'src/util/I18N';
import LoadingSpinner from 'src/components/LoadingSpinner';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend);

const NUMBER_OF_DAY = 15;

export default function AdminDashboard() {
	return (
		<main className='h-full w-full overflow-y-auto'>
			<section className='grid grid-cols-[repeat(auto-fill,min(800px,100%))]'>
				<DailyUserChar />
			</section>
		</main>
	);
}

function DailyUserChar() {
	const [dailyUser, setDailyUser] = useState<Metric[]>([]);
	const [loggedDailyUser, setLoggedDailyUser] = useState<Metric[]>([]);
	const [loading, setLoading] = useState(0);

	let fixedDailyUser: Metric[] = fill(new Date(), NUMBER_OF_DAY, dailyUser, 0);
	let fixedLoggedDailyUser: Metric[] = fill(new Date(), NUMBER_OF_DAY, loggedDailyUser, 0);

	function fill(start: Date, numberOfDay: number, array: Metric[], defaultValue: number) {
		let result: Metric[] = [];

		for (let i = 0; i < numberOfDay + 1; i++) {
			let targetDay = new Date(start);
			targetDay.setDate(start.getDate() - numberOfDay + i);
			let value = array.find((v) => v.time.getFullYear() === targetDay.getFullYear() && v.time.getMonth() === targetDay.getMonth() && v.time.getDate() === targetDay.getDate());
			if (value === undefined) result.push({ value: defaultValue, time: targetDay });
			else result.push(value);
		}
		return result;
	}

	useEffect(() => {
		let start = new Date();
		let end = new Date();

		start.setDate(new Date().getDate() - NUMBER_OF_DAY);

		setLoading(2);

		API.getMetric(start, end, 'daily_user')
			.then((result) =>
				setDailyUser(() => {
					return result.data.map((v: any) => {
						let time = new Date();
						time.setFullYear(v.time[0]);
						time.setMonth(v.time[1] - 1);
						time.setDate(v.time[2]);

						return { value: v.value, time };
					});
				}),
			)
			.then(() => setLoading((prev) => prev - 1))
			.catch((error) => console.log(error));

		API.getMetric(start, end, 'logged_daily_user')
			.then((result) =>
				setLoggedDailyUser(() => {
					return result.data.map((v: any) => {
						let time = new Date();
						time.setFullYear(v.time[0]);
						time.setMonth(v.time[1] - 1);
						time.setDate(v.time[2]);

						return { value: v.value, time };
					});
				}),
			)
			.then(() => setLoading((prev) => prev - 1))
			.catch((error) => console.log(error));
	}, []);

	const option = {
		responsive: true,
		maintainAspectRatio: true,
		scales: {
			y: {
				beginAtZero: true,
				ticks: {
					precision: 0,
				},
			},
		},
	};

	const data = {
		labels: fixedDailyUser.map((v) => `${v.time.getFullYear()}-${v.time.getMonth() + 1}-${v.time.getDate()}`),
		datasets: [
			{
				label: i18n.t('daily-user').toString(),
				fill: true,
				borderColor: 'rgb(53, 162, 235, 0.5)',
				backgroundColor: 'transparent',
				data: fixedDailyUser.map((d) => d.value),
			},
			{
				label: i18n.t('logged-daily-user').toString(),
				fill: true,
				borderColor: 'rgb(34, 197, 94, 0.5)',
				backgroundColor: 'transparent',
				data: fixedLoggedDailyUser.map((d) => d.value),
			},
		],
	};

	return (
		<div className='flex aspect-[2] h-full w-full items-center justify-center rounded-lg bg-slate-600 bg-opacity-40 p-2'>
			{loading > 0 ? <LoadingSpinner /> : <Line className='relative h-full w-full whitespace-nowrap' options={option} data={data} />}
		</div>
	);
}
