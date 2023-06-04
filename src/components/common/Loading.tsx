import '../../styles.css';

import React, { useEffect, useState } from 'react';

const Loading = () => {
	const [message, setMessage] = useState<string>('Loading');

	useEffect(() => {
	
		setTimeout(() => setMessage('Please wait 1-2 minutes'), 5000);
	
	}, []);

	return <div className='flexbox-center dark-background'>{message}</div>;
};

export default Loading;
