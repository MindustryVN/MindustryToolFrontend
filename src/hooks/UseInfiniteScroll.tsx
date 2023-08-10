import 'src/styles.css';

import { useIntersection } from '@mantine/hooks';
import React, { useEffect, useRef } from 'react';
import { ReactNode } from 'react-markdown/lib/ast-to-react';
import { UseInfinitePage } from 'src/hooks/UseInfinitePage';

interface DBObject {
	id: string;
}

export default function useInfiniteScroll<T extends DBObject>(useInfinitePage: UseInfinitePage<T>, mapper: (v: T) => ReactNode) {
	const lastPageRef = useRef<HTMLElement>(null);
	const { ref, entry } = useIntersection({
		root: lastPageRef.current,
		threshold: 1,
	});

	useEffect(() => {
		if (entry?.isIntersecting && useInfinitePage.hasMore && !useInfinitePage.isLoading) useInfinitePage.loadNextPage();
	}, [entry, useInfinitePage]);

	const pages = useInfinitePage.pages.map((m) => mapper(m));

	pages.push(<div key={0} ref={ref}></div>);

	return { ...useInfinitePage, pages: pages };
}
