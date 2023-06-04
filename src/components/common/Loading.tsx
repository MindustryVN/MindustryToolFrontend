import '../../styles.css';

import React, { useState } from 'react';

const Loading = () => {
	const [message, setMessage] = useState<string>('Loading');

    setTimeout(() => setMessage("Please wait 1-2 minutes"), 60000)

	return <div className='flexbox-center dark-background'>{message}</div>;
};

export default Loading;
