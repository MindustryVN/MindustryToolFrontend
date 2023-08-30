import React from 'react';
import MessageScreen from 'src/components/MessageScreen';

export default function LoadingSpinner() {
	return (
		<MessageScreen>
			<div className='animate-spin w-4 h-4' />
		</MessageScreen>
	);
}
