import 'src/styles.css';

import { useIntersection } from '@mantine/hooks';
import React, { useEffect, useRef } from 'react';
import { ReactNode } from 'react-markdown/lib/ast-to-react';

interface DBObject {
	id: string;
}

export default function useInfiniteScroll<T extends DBObject>(pages: T[], hasMore : boolean, mapper: (v: T) => ReactNode, loadNextPage: () => void) {
	const lastPageRef = useRef<HTMLElement>(null);
	const { ref, entry } = useIntersection({
		root: lastPageRef.current,
		threshold: 1,
	});

	useEffect(() => {
		if (entry?.isIntersecting && hasMore) loadNextPage();
	}, [entry, loadNextPage, hasMore]);

	const infPages = pages.map((m, index) => {
		if (index === pages.length - 1)
			return (
				<section className='flex-row' key={m.id} ref={ref}>
					{mapper(m)}
				</section>
			);

		return (
			<section className='flex-row' key={m.id}>
				{mapper(m)}
			</section>
		);
	});

	return infPages;
}
