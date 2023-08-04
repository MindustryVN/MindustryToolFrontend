import { AxiosRequestConfig } from 'axios';
import { useEffect, useState } from 'react';
import { API } from 'src/API';

var cancelRequest: AbortController;

export default function useQuery<T>(url: string, initialValue?: T, searchConfig?: AxiosRequestConfig<any>) {
	const [data, setData] = useState<T | undefined>(initialValue);
	const [isLoading, setIsLoading] = useState(true);
	const [isError, setIsError] = useState(false);

	useEffect(() => {
		if (cancelRequest) cancelRequest.abort();

		cancelRequest = new AbortController();

		setIsError(false);
		setIsLoading(true);

		API.get(`${url}`, { ...searchConfig, signal: cancelRequest.signal }) //
			.then((result) => setData(result.data))
			.catch(() => setIsError(true))
			.finally(() => setIsLoading(false)); //
	}, [searchConfig, url]);

	return { data: data, isLoading: isLoading, isError: isError };
}
