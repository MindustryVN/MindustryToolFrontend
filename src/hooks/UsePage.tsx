import { AxiosRequestConfig } from 'axios';
import { useEffect, useRef, useState } from 'react';
import { API } from 'src/API';
import { MAX_ITEM_PER_PAGE } from 'src/config/Config';
import { Utils } from 'src/util/Utils';

export default function usePage<T>(url: string, searchConfig?: AxiosRequestConfig<any>) {
	const [pages, setPages] = useState<Array<Array<T>>>([[]]);
	const [isLoading, setIsLoading] = useState(false);
	const [isError, setIsError] = useState(false);
	const [hasMore, setHasMore] = useState(false);

	const ref = useRef({ url: url, searchConfig: searchConfig });

	useEffect(() => {
		setIsLoading(true);
		setIsError(false);
		setPages([[]]);

		API.REQUEST.get(`${ref.current.url}/0`, searchConfig) //
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
				API.REQUEST.get(`${url}/${i}`, searchConfig)
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

			API.REQUEST.get(`${url}/${requestPage}`, searchConfig)
				.then((result) => {
					let data: T[] = result.data;
					handleSetPage(requestPage, data);
				})
				.catch(() => setIsError(true))
				.finally(() => setIsLoading(false)); //
		},
	};
}
