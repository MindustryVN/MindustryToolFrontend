import { useIntersection } from '@mantine/hooks';
import React, { ReactNode, useEffect, useRef } from 'react';
import { Trans } from 'react-i18next';
import Button from 'src/components/Button';
import LoadingSpinner from 'src/components/LoadingSpinner';
import useWindowFocus from 'src/context/WindowFocusContext';
import { UseInfinitePage } from 'src/hooks/UseInfinitePage';
import i18n from 'src/util/I18N';
import { cn } from 'src/util/Utils';

interface InfiniteScrollProps<T> {
	className?: string;
    id?:string;
	infinitePage: UseInfinitePage<T>;
	mapper: (v: T, index?: number) => ReactNode;
}

export default function InfiniteScroll<T>({id, className, infinitePage, mapper }: InfiniteScrollProps<T>) {
	const { windowIsFocus } = useWindowFocus();
	const { url, hasMore, isLoading, isError, pages, loadNextPage } = infinitePage;

	const rootRef = useRef<HTMLElement>(null);
	const { ref, entry } = useIntersection({
		root: rootRef.current,
		threshold: 1,
	});

	useEffect(() => {
		if (entry?.isIntersecting && hasMore && !isLoading && !isError && windowIsFocus) {
			loadNextPage();
		}
	}, [entry, hasMore, isError, isLoading, windowIsFocus, loadNextPage]);

	const nodes = pages.map((m, index) => mapper(m, index));
	const loadingSpinner = isLoading || hasMore ? <LoadingSpinner className='w-full flex justify-center items-center' /> : <></>;
	const loadMore = !isLoading && isError && (
		<div className='col-span-full flex items-center justify-center' key={url + 'load-more'}>
			<Button className='px-2 py-1' title={i18n.t('load-more')} onClick={() => loadNextPage()}>
				<Trans i18nKey='load-more' />
			</Button>
		</div>
	);

	const noMore = !isLoading && !hasMore && (
		<div className='col-span-full flex items-center justify-center' key={url + 'no-more'}>
			<Trans i18nKey='no-more' />
		</div>
	);

	return (
		<>
			<section id={id} className={cn(className)}>{nodes}</section>
			<div className='h-4' key={url} ref={ref} />
			{loadingSpinner}
			{loadMore}
			{noMore}
		</>
	);
}
