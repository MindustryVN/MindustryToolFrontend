import React from "react";

export const TagSubmitButton = ({ callback }: { callback: () => void }) => (
	<button
		className='button-transparent'
		title='Add'
		type='button'
		onClick={(event) => {
			callback();
			event.stopPropagation();
		}}>
		<img src='/assets/icons/check.png' alt='check' />
	</button>
);
