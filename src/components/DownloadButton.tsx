import React from 'react';

interface DownloadButtonProps {
	href: string;
	download?: string;
}

export default function DownloadButton({ href, download }: DownloadButtonProps) {
	return (
		<a className='flex items-center justify-center border-slate-500 border-2 rounded-lg h-8 w-8' href={href} download={download}>
			<img src='/assets/icons/download.png' alt='download' />
		</a>
	);
}
