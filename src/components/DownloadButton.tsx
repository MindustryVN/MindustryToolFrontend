import React from 'react';
import { cn } from 'src/util/Utils';

interface DownloadButtonProps {
	className?: string;
	href: string;
	download?: string;
}

export default function DownloadButton({ className, href, download }: DownloadButtonProps) {
	return (
		<a className={cn('flex items-center justify-center border-slate-500 border-2 rounded-lg hover:dark:bg-blue-500', className)} href={href} download={download}>
			<img src='/assets/icons/download.png' alt='download' />
		</a>
	);
}
