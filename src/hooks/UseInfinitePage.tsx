import { AxiosRequestConfig } from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';
import { API } from 'src/API';
import { array2dToArray1d } from 'src/util/Utils';

export interface UseInfinitePage<T> {
	pages: T[];
	isLoading: boolean;
	isError: boolean;
	hasMore: boolean;
	loadNextPage: () => void;
	reloadPage: () => void;
	filter: (predicate: (data: T) => boolean) => void;
}

export default function useInfinitePage<T>(url: string, itemPerPage: number, searchConfig?: AxiosRequestConfig<any>): UseInfinitePage<T> {
	const cancelRequest = useRef<AbortController>(new AbortController());
	const [pages, setPages] = useState<Array<Array<T>>>([[]]);
	const [isLoading, setIsLoading] = useState(true);
	const [isError, setIsError] = useState(false);
	const [hasMore, setHasMore] = useState(false);

	function getPage(url: string, page: number, itemPerPage: number, searchConfig: AxiosRequestConfig<any> | undefined) {
		
		cancelRequest.current.abort();
		cancelRequest.current = new AbortController();

		setIsLoading(true);

		if (!searchConfig) {
			searchConfig = {
				params: {
					page: page,
					items: itemPerPage,
				},
			};
		}

		searchConfig = { params: { ...searchConfig.params, page: page, items: itemPerPage }, signal: cancelRequest.current.signal };

		return API.get(url, searchConfig);
	}

	useEffect(() => {
		setIsError(false);
		setPages([[]]);

		getPage(url, 0, itemPerPage, searchConfig) //
			.then((result) =>
				setPages(() => {
					let data: T[] = result.data;
					if (data.length < itemPerPage) setHasMore(false);
					else setHasMore(true);
					return [data];
				}),
			)
			.catch(() => setIsError(true))
			.finally(() => setIsLoading(false)); //

		return () => cancelRequest.current.abort();
	}, [searchConfig, itemPerPage, url]);

	const handleSetPage = useCallback(
		(pageNumber: number, data: T[]) => {
			if (data.length < itemPerPage) setHasMore(false);
			else setHasMore(true);

			if (pages.length <= pageNumber) {
				setPages((prev) => [...prev, data]);
			} else {
				setPages((prev) => {
					prev[prev.length - 1] = data;
					return [...prev];
				});
			}
		},
		[itemPerPage, pages],
	);

	return {
		pages: array2dToArray1d(pages),
		isLoading: isLoading,
		isError: isError,
		hasMore: hasMore,

		loadNextPage: useCallback(() => {
			if (isLoading) return;

			setIsError(false);

			const lastIndex = pages.length - 1;
			const newPage = pages[lastIndex].length === itemPerPage;
			const requestPage = newPage ? lastIndex + 1 : lastIndex;

			getPage(url, requestPage, itemPerPage, searchConfig)
				.then((result) => handleSetPage(requestPage, result.data))
				.catch(() => setIsError(true))
				.finally(() => setIsLoading(false)); //
		}, [handleSetPage, isLoading, itemPerPage, url, searchConfig, pages]),

		reloadPage: () => {
			if (isLoading) return;

			setIsError(false);
			setPages([]);
			getPage(url, 0, itemPerPage, searchConfig)
				.then((result) => handleSetPage(0, result.data))
				.catch(() => setIsError(true))
				.finally(() => setIsLoading(false)); //
		},

		filter: (predicate: (prev: T) => boolean) => {
			pages.map((page) => page.filter(predicate));
		},
	};
}
