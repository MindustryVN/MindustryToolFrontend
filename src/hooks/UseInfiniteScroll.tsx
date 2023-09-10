import { useIntersection } from '@mantine/hooks';
import React, { useEffect, useRef } from 'react';
import { ReactNode } from 'react-markdown/lib/ast-to-react';
import { UseInfinitePage } from 'src/hooks/UseInfinitePage';
import useWindowFocus from 'src/context/WindowFocusContext';

export default function useInfiniteScroll<T>(useInfinitePage: UseInfinitePage<T>, mapper: (v: T, index?: number) => ReactNode) {
	const { windowIsFocus } = useWindowFocus();

	const rootRef = useRef<HTMLElement>(null);
	const { ref, entry } = useIntersection({
		root: rootRef.current,
		threshold: 1,
	});

	useEffect(() => {
		if (entry?.isIntersecting && useInfinitePage.hasMore && !useInfinitePage.isLoading && !useInfinitePage.isError && windowIsFocus) {
			useInfinitePage.loadNextPage();
		}
	}, [entry, useInfinitePage, windowIsFocus]);

	const pages = useInfinitePage.pages.map((m, index) => mapper(m, index));

	if (useInfinitePage.hasMore || useInfinitePage.hasMore) {
		pages.push(<div key={useInfinitePage.url} ref={ref} />);
	}

	return { ...useInfinitePage, pages: pages };
}
