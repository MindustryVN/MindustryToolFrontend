import React from 'react';
import { Trans } from 'react-i18next';
import LoadUserName from 'src/components/LoadUserName';
import { cn } from 'src/util/Utils';

interface AuthorProps {
	className?: string;
	authorId: string;
}

export default function Author({ className, authorId, ...props }: AuthorProps & React.HTMLProps<HTMLDivElement>) {
	return (
		<section className={cn('flex flex-row gap-2 whitespace-nowrap', className)} {...props}>
			<Trans i18nKey='author' /> <LoadUserName userId={authorId} />
		</section>
	);
}
