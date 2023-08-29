import { AxiosRequestConfig } from 'axios';
import { useEffect, useState } from 'react';
import { API } from 'src/API';


export default function useQuery<T>(url: string, initialValue?: T, searchConfig?: AxiosRequestConfig<any>) {
	const [data, setData] = useState<T | undefined>(initialValue);
	const [isLoading, setIsLoading] = useState(true);
	const [isError, setIsError] = useState(false);

	useEffect(() => {
		setIsError(false);
		setIsLoading(true);

		API.get(`${url}`, { ...searchConfig }) //
			.then((result) => setData(result.data))
			.catch((error) => {
				setIsError(true);
				console.log(error);
			})
			.finally(() => setIsLoading(false)); //
	}, [searchConfig, url]);

	return { data: data, isLoading: isLoading, isError: isError };
}
