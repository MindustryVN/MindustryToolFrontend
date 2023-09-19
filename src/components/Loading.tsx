import React, { useEffect, useState } from 'react';
import { Trans } from 'react-i18next';
import MessageScreen from 'src/components/MessageScreen';

export default function Loading() {
	const [content, setMessage] = useState<string>('loading.short');

	useEffect(() => {
		let timeout = setTimeout(() => setMessage('loading.long'), 8000);

		return () => clearTimeout(timeout);
	}, []);

	return (
		<MessageScreen>
			<Trans i18nKey={content} />
		</MessageScreen>
	);
}
