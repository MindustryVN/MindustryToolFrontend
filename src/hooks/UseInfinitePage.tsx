import { AxiosRequestConfig } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { API } from 'src/API';
import { Utils } from 'src/util/Utils';

var cancelRequest: AbortController;

export interface UseInfinitePage<T> {
	pages: T[];
	isLoading: boolean;
	isError: boolean;
	hasMore: boolean;
	reloadPage: () => void;
	loadNextPage(): void;
}

export default function useInfinitePage<T>(url: string, itemPerPage: number, searchConfig?: AxiosRequestConfig<any>) : UseInfinitePage<T> {
	const [pages, setPages] = useState<Array<Array<T>>>([[]]);
	const [isLoading, setIsLoading] = useState(true);
	const [isError, setIsError] = useState(false);
	const [hasMore, setHasMore] = useState(false);

	function getPage(url: string, page: number, itemPerPage: number, searchConfig: AxiosRequestConfig<any> | undefined) {
		if (cancelRequest) cancelRequest.abort();

		cancelRequest = new AbortController();

		setIsLoading(true);

		if (!searchConfig) {
			searchConfig = {
				params: {
					page: page,
					items: itemPerPage,
				},
			};
		}

		searchConfig = { params: { ...searchConfig.params, page: page, items: itemPerPage }, signal: cancelRequest.signal };

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
		pages: Utils.array2dToArray1d(pages),
		isLoading: isLoading,
		isError: isError,
		hasMore: hasMore,

		reloadPage: useCallback(() => {
			if (isLoading) return;

			setIsError(false);

			setPages([[]]);
			getPage(
				url,
				0,
				pages.map((ele) => ele.length).reduce((prev, curr) => curr + prev, 0),
				searchConfig,
			)
				.then((result) => {
					let data: T[] = result.data;
					setPages(() => {
						let a: T[][] = [];

						for (var i = 0; i < data.length; i = i + itemPerPage) a.push(data.slice(i, i + itemPerPage));

						return a;
					});
				})
				.catch(() => setIsError(true))
				.finally(() => setIsLoading(false)); //
		}, [isLoading, itemPerPage, pages, searchConfig, url]),

		loadNextPage: useCallback(() => {
			if (isLoading) return;

			setIsError(false);

			const lastIndex = pages.length - 1;
			const newPage = pages[lastIndex].length === itemPerPage;
			const requestPage = newPage ? lastIndex + 1 : lastIndex;

			console.log('reload');

			getPage(url, requestPage, itemPerPage, searchConfig)
				.then((result) => {
					let data: T[] = result.data;
					handleSetPage(requestPage, data);
				})
				.catch(() => setIsError(true))
				.finally(() => setIsLoading(false)); //
		}, [handleSetPage, isLoading, itemPerPage, url, searchConfig, pages]),
	};
}
