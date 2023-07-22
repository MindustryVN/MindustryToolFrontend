import 'src/styles.css';

import React from 'react';
import LoadUserName from 'src/components/user/LoadUserName';

export default function InfoPage() {
	return (
		<main className='flex-row h100p w100p center medium-gap'>
			Page owner: <LoadUserName userId='64b63239e53d0c354d505733' />
		</main>
	);
}
