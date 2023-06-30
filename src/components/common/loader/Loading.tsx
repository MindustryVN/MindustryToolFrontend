import React, { useEffect, useState } from 'react';
import { Trans } from 'react-i18next';

import '../../../styles.css';
import './Loading.css';

const Loading = () => {
	const [message, setMessage] = useState<string>('loading');

	useEffect(() => {
		setTimeout(() => setMessage('loading.wait12'), 5000);
	}, []);

	return (
		<span className='flexbox-center loading'>
			<Trans i18nKey={message} />
		</span>
	);
};

export default Loading;
