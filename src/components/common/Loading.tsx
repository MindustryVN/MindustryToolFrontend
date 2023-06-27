import { Trans } from 'react-i18next';
import '../../styles.css';

import React, { useEffect, useState } from 'react';

const Loading = () => {
	const [message, setMessage] = useState<string>('loading');

	useEffect(() => {
	
		setTimeout(() => setMessage('loading.wait12'), 5000);
	
	}, []);

	return (
		<div className='flexbox-center dark-background'>
			<Trans i18nKey={message} />
		</div>
	);
};

export default Loading;
