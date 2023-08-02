import React, { useEffect, useState } from 'react';
import { Trans } from 'react-i18next';

import 'src/styles.css';
import './Loading.css';

export default function Loading() {
	const [content, setMessage] = useState<string>('loading.short');

	useEffect(() => {
		setTimeout(() => setMessage('loading.long'), 5000);
	}, []);

	return (
		<span className='flex-center loading'>
			<Trans i18nKey={content} />
		</span>
	);
}
