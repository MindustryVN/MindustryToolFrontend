import 'src/styles.css';

import { useIntersection } from '@mantine/hooks';
import React, { useEffect, useRef } from 'react';
import { ReactNode } from 'react-markdown/lib/ast-to-react';
import { UseInfinitePage } from 'src/hooks/UseInfinitePage';
import useWindowFocus from 'src/context/WindowFocusContext';
import { Trans } from 'react-i18next';
import LoadingSpinner from 'src/components/LoadingSpinner';

export default function useInfiniteScroll<T>(useInfinitePage: UseInfinitePage<T>, mapper: (v: T, index?: number) => ReactNode) {
	const { windowIsFocus } = useWindowFocus();

	const rootRef = useRef<HTMLElement>(null);
	const { ref, entry } = useIntersection({
		root: rootRef.current,
		threshold: 1,
	});

	useEffect(() => {
		if (entry?.isIntersecting && useInfinitePage.hasMore && !useInfinitePage.isLoading && windowIsFocus) {
			useInfinitePage.loadNextPage();
		}
	}, [entry, useInfinitePage, windowIsFocus]);

	const pages = useInfinitePage.pages.map((m, index) => mapper(m, index));

	if (useInfinitePage.isLoading) {
		pages.push(<LoadingSpinner />);
	} else if (useInfinitePage.hasMore) {
		pages.push(<div key={-1} ref={ref}></div>);
	} else {
		pages.push(<Trans i18nKey='no-more' />);
	}

	return { ...useInfinitePage, pages: pages };
}
