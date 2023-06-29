import './TagRemoveButton.css';

import React from 'react';

export const TagRemoveButton = ({ callback }: { callback: () => void }) => (
	<button className='tag-remove-button' title='Add' type='button' onClick={() => callback()}>
		<img src='/assets/icons/quit.png' alt='submit' />
	</button>
);
