import { AxiosRequestConfig } from 'axios';
import { useEffect, useRef, useState } from 'react';
import { API } from 'src/API';
import { MAX_ITEM_PER_PAGE } from 'src/config/Config';
import { Utils } from 'src/util/Utils';

export default function usePage<T>(url: string, itemPerPage: number, searchConfig?: AxiosRequestConfig<any>) {
	const [pages, setPages] = useState<Array<Array<T>>>([[]]);
	const [isLoading, setIsLoading] = useState(true);
	const [isError, setIsError] = useState(false);
	const [hasMore, setHasMore] = useState(false);

	const ref = useRef({ url, itemPerPage });

	useEffect(() => {
		setIsLoading(true);
		setIsError(false);
		setPages([[]]);

		getPage(ref.current.url, 0, ref.current.itemPerPage, searchConfig) //
			.then((result) =>
				setPages(() => {
					let data: T[] = result.data;
					if (data.length < MAX_ITEM_PER_PAGE) setHasMore(false);
					else setHasMore(true);
					return [data];
				}),
			)
			.catch(() => setIsError(true))
			.finally(() => setIsLoading(false)); //
	}, [searchConfig]);

	function handleSetPage(pageNumber: number, data: T[]) {
		if (data.length < MAX_ITEM_PER_PAGE) setHasMore(false);
		else setHasMore(true);

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
		pages: Utils.array2dToArray1d(pages),
		isLoading: isLoading,
		isError: isError,
		hasMore: hasMore,

		reloadPage: function reloadPage() {
			if (isLoading) return;

			let page = pages.length;

			setPages([[]]);
			setIsLoading(true);
			setIsError(false);

			for (let i = 0; i < page; i++) {
				getPage(url, i, itemPerPage, searchConfig)
					.then((result) => {
						let data: T[] = result.data;
						handleSetPage(i, data);
						if (data.length < MAX_ITEM_PER_PAGE) {
							i = page;
						}
					})
					.catch(() => setIsError(true))
					.finally(() => setIsLoading(false)); //
			}
		},

		loadPage: function loadPage() {
			if (isLoading) return;

			setIsLoading(true);
			setIsError(false);

			const lastIndex = pages.length - 1;
			const newPage = pages[lastIndex].length === MAX_ITEM_PER_PAGE;
			const requestPage = newPage ? lastIndex + 1 : lastIndex;

			getPage(url, requestPage, itemPerPage, searchConfig)
				.then((result) => {
					let data: T[] = result.data;
					handleSetPage(requestPage, data);
				})
				.catch(() => setIsError(true))
				.finally(() => setIsLoading(false)); //
		},
	};
}

function getPage(url: string, page: number, itemPerPage: number, searchConfig: AxiosRequestConfig<any> | undefined) {
	if (!searchConfig) {
		searchConfig = {
			params: {
				page: page,
				items: itemPerPage,
			},
		};
	}

	searchConfig = { params: { ...searchConfig.params, page: page, items: itemPerPage } };

	return API.get(url, searchConfig);
}
