import { useIntersection } from '@mantine/hooks';
import React, { useEffect, useRef } from 'react';
import { ReactNode } from 'react-markdown/lib/ast-to-react';
import { UseInfinitePage } from 'src/hooks/UseInfinitePage';
import useWindowFocus from 'src/context/WindowFocusContext';
import Button from 'src/components/Button';
import i18n from 'src/util/I18N';
import { Trans } from 'react-i18next';

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

	pages.push(<div key={useInfinitePage.url} ref={ref} />);

	if (!useInfinitePage.isLoading && useInfinitePage.isError) {
		pages.push(
			<div className='col-span-full flex items-center justify-center' key={useInfinitePage.url + 'button'}>
				<Button className='px-2 py-1' title={i18n.t('load-more')} onClick={() => useInfinitePage.loadNextPage()}>
					<Trans i18nKey='load-more' />
				</Button>
			</div>,
		);
	}

	if (!useInfinitePage.hasMore) {
		pages.push(
			<div className='col-span-full flex items-center justify-center' key={useInfinitePage.url + 'no-more'}>
				<Trans i18nKey='no-more' />
			</div>,
		);
	}

	return { ...useInfinitePage, pages: pages };
}
