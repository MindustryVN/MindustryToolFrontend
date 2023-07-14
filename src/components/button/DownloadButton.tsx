import 'src/styles.css';

import React from 'react';

interface DownloadButtonProps {
	href: string;
	download?: string;
}

export default function DownloadButton(props: DownloadButtonProps) {
	return (
		<a className='button' href={props.href} download={props.download}>
			<img src='/assets/icons/download.png' alt='download' />
		</a>
	);
}
