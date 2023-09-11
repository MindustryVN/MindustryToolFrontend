import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { API } from 'src/API';
import { Metric } from 'src/data/Metric';
import { getWeek } from 'src/util/Utils';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend } from 'chart.js';
import i18n from 'src/util/I18N';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend);

export default function AdminDashboard() {
	const [dailyUser, setDailyUser] = useState<Metric[]>([]);

	useEffect(() => {
		let week = getWeek(new Date());
		console.log(week);

		API.getMetric(week.start, week.end, 'DAILY_USER')
			.then((result) => setDailyUser(result.data))
			.catch((error) => console.log(error));
	}, []);

	console.log(dailyUser);

	return (
		<main>
			<Line className='w-1/2'
				options={{ responsive: true }}
				data={{
					labels: dailyUser.map((d) => d.time),
					datasets: [{ label: i18n.t('daily-user').toString(), fill: true, backgroundColor: 'rgb(53, 162, 235, 0.5)', data: dailyUser.map((d) => d.value) }],
				}}
			/>
		</main>
	);
}
