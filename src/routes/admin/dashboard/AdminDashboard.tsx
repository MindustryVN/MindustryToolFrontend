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

	useEffect(() => {
		let start = new Date();
		start.setDate(new Date().getDate() - 30);
		let end = new Date();

		API.getMetric(start, end, 'DAILY_USER')
			.then((result) => setDailyUser(result.data))
			.catch((error) => console.log(error));
	}, []);

	if (dailyUser.length === 0) return <LoadingSpinner className='flex w-full items-center justify-center' />;

	return (
		<main className='h-full w-full overflow-y-auto p-12'>
			<section className='grid grid-cols-[repeat(auto-fill,min(500px,80vw))]'>
				<Line
					className='relative h-full w-full whitespace-nowrap'
					options={{ responsive: true, maintainAspectRatio: true }}
					data={{
						labels: dailyUser.map((d) => d.time),
						datasets: [{ label: i18n.t('daily-user').toString(), fill: true, backgroundColor: 'rgb(53, 162, 235, 0.5)', data: dailyUser.map((d) => d.value) }],
					}}
				/>
			</section>
		</main>
	);
}
