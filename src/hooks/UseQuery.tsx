import { AxiosRequestConfig } from 'axios';
import { useEffect, useRef, useState } from 'react';
import { API } from 'src/API';

export default function useQuery<T>(url: string, initialValue: T, searchConfig?: AxiosRequestConfig<any>) {
	const [data, setData] = useState<T>(initialValue);
	const [isLoading, setIsLoading] = useState(true);
	const [isError, setIsError] = useState(false);

	const ref = useRef(url);

	useEffect(() => {
		setIsLoading(true);
		setIsError(false);

		API.REQUEST.get(`${ref.current}`, searchConfig) //
			.then((result) => setData(result.data))
			.catch(() => setIsError(true))
			.finally(() => setIsLoading(false)); //
            
	}, [searchConfig]);

	return { data: data, isLoading: isLoading, isError: isError };
}
