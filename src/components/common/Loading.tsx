import { Trans } from 'react-i18next';
import '../../styles.css';

import React, { useEffect, useState } from 'react';

const Loading = () => {
	const [message, setMessage] = useState<string>('loading');

	useEffect(() => {
		setTimeout(() => setMessage('loading.wait12'), 5000);
	}, []);

	return (
		<span className='flexbox-center '>
			<Trans i18nKey={message} />
		</span>
	);
};

export default Loading;
