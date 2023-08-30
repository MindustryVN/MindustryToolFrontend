import React, { useEffect, useState } from 'react';
import { Trans } from 'react-i18next';
import MessageScreen from 'src/components/MessageScreen';

export default function Loading() {
	const [content, setMessage] = useState<string>('loading.short');

	useEffect(() => {
		setTimeout(() => setMessage('loading.long'), 5000);
	}, []);

	return (
		<MessageScreen>
			<Trans i18nKey={content} />
		</MessageScreen>
	);
}
