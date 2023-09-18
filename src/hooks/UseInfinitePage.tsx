import { AxiosRequestConfig } from 'axios';
import { useEffect, useRef, useState } from 'react';
import { API } from 'src/API';
import { array2dToArray1d } from 'src/util/Utils';

export interface UseInfinitePage<T> {
	url: string;
	pages: T[];
	isLoading: boolean;
	isError: boolean;
	hasMore: boolean;
	itemPerPage: number;
	loadNextPage: () => void;
	reloadPage: () => void;
	filter: (predicate: (data: T) => boolean) => void;
}

export default function useInfinitePage<T>(url: string, itemPerPage: number, searchConfig?: AxiosRequestConfig<any>): UseInfinitePage<T> {
	const cancelRequest = useRef<AbortController>(new AbortController());
	const [pages, setPages] = useState<Array<Array<T>>>([[]]);
	const [loading, setLoading] = useState(0);
	const [isError, setIsError] = useState(false);
	const [hasMore, setHasMore] = useState(true);

	function getPage(url: string, page: number, itemPerPage: number, searchConfig: AxiosRequestConfig<any> | undefined) {
		cancelRequest.current.abort();
		cancelRequest.current = new AbortController();

		setLoading((prev) => prev + 1);

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
					setIsError(false);
					return [data];
				}),
			)
			.catch(() => setIsError(true))
			.finally(() => setLoading((prev) => prev - 1)); //

		return () => cancelRequest.current.abort();
	}, [searchConfig, itemPerPage, url]);

	function handleSetPage(pageNumber: number, data: T[]) {
		if (data.length < itemPerPage) setHasMore(false);
		else setHasMore(true);
		setIsError(false);

		if (pages.length <= pageNumber) {
			setPages((prev) => [...prev, data]);
		} else {
			setPages((prev) => {
				prev[prev.length - 1] = data;
				return [...prev];
			});
		}
	}

	return {
		url: url,
		itemPerPage: itemPerPage,
		pages: array2dToArray1d(pages),
		isLoading: loading > 0,
		isError: isError,
		hasMore: hasMore,

		loadNextPage: function loadNextPage() {
			if (loading > 0) return;

			setIsError(false);

			const lastIndex = pages.length - 1;
			const newPage = pages[lastIndex].length === itemPerPage;
			const requestPage = newPage ? lastIndex + 1 : lastIndex;

			getPage(url, requestPage, itemPerPage, searchConfig)
				.then((result) => handleSetPage(requestPage, result.data))
				.catch(() => setIsError(true))
				.finally(() => setLoading((prev) => prev - 1)); //
		},

		reloadPage: function reloadPage() {
			if (loading > 0) return;

			setIsError(false);
			setPages([]);
			getPage(url, 0, itemPerPage, searchConfig)
				.then((result) => handleSetPage(0, result.data))
				.catch(() => setIsError(true))
				.finally(() => setLoading((prev) => prev - 1)); //
		},

		filter: (predicate: (prev: T) => boolean) => {
			setPages((prev) => prev.map((page) => page.filter(predicate)));
		},
	};
}
