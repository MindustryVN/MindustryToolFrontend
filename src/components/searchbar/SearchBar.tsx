import './SearchBar.css';

import React, { ReactNode } from 'react';

interface SearchBarProps {
	placeholder: string;
	value: string;
	submitButton?: ReactNode;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SearchBar(props: SearchBarProps) {
	return (
		<section className='search-bar'>
			<input className='input-bar' type='text' placeholder='Search' value={props.value} onChange={props.onChange} />
			{props.submitButton}
		</section>
	);
}
