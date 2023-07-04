import './SearchBar.css';

import React, { ReactNode } from 'react';

interface SearchBarParam {
	placeholder: string;
	value: string;
	submitButton?: ReactNode;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SearchBar(param: SearchBarParam) {
	return (
		<section className='search-bar'>
			<input className='input-bar' type='text' placeholder='Search' value={param.value} onChange={param.onChange} />
			{param.submitButton}
		</section>
	);
}
