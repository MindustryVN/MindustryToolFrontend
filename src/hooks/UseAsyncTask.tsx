import React from 'react';

export default function useAsyncTask(task : Promise<any>) {
	const [loading, setLoading] = React.useState(false);

	return { loading , task : task.finally(() => setLoading(false)) };
}
