import { AxiosRequestConfig } from 'axios';
import { useEffect, useRef, useState } from 'react';
import { API } from 'src/API';
import { LoaderState, MAX_ITEM_PER_PAGE } from 'src/config/Config';
import { Utils } from 'src/util/Utils';

export default function usePage<T>(url: string, searchConfig?: AxiosRequestConfig<any>) {
	const [pages, setPages] = useState<Array<Array<T>>>([[]]);
	const [loaderState, setLoaderState] = useState<LoaderState>();

	const ref = useRef({ url: url, searchConfig: searchConfig });

	useEffect(() => {
		setLoaderState('loading');
		setPages([]);
		API.REQUEST.get(`${ref.current.url}/0`, searchConfig) //
			.then((result) => setPages(() => [result.data]))
			.catch(() => setLoaderState('error')) //
			.finally(() => setLoaderState('more'));
	}, [searchConfig]);

	function addNewPage(data: T[]) {
		setPages((prev) => [...prev, data]);
	}

	function modifyLastPage(data: T[]) {
		setPages((prev) => {
			prev[prev.length - 1] = data;
			return [...prev];
		});
	}

	return {
		pages: Utils.array2dToArray1d(pages),
		loaderState: loaderState,

		loadToPage: function loadToPage(page: number) {
			setPages([[]]);
			setLoaderState('loading');

			for (let i = 0; i < page; i++) {
				API.REQUEST.get(`${url}/${i}`, searchConfig)
					.then((result) => {
						let data: T[] = result.data;
						if (data) {
							addNewPage(data);
							if (data.length < MAX_ITEM_PER_PAGE) {
								i = page;
								setLoaderState('out');
							} else setLoaderState('more');
						} else setLoaderState('out');
					})
					.catch(() => setLoaderState('error'));
			}
		},

		loadPage: function loadPage() {
			setLoaderState('loading');

			const lastIndex = pages.length - 1;
			const newPage = pages[lastIndex].length === MAX_ITEM_PER_PAGE;
			const requestPage = newPage ? lastIndex + 1 : lastIndex;

			API.REQUEST.get(`${url}/${requestPage}`, searchConfig)
				.then((result) => {
					let data: T[] = result.data;
					if (data) {
						if (newPage) addNewPage(data);
						else modifyLastPage(data);

						if (data.length < MAX_ITEM_PER_PAGE) setLoaderState('out');
						else setLoaderState('more');
					} else setLoaderState('out');
				})
				.catch(() => setLoaderState('error'));
		},
	};
}
