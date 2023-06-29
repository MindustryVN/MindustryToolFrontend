import './SearchBar.css';

import React, { ReactNode } from 'react';

export default class SearchBar extends React.Component<{ placeholder: string; value: string; onChange: (event: React.ChangeEvent<HTMLInputElement>) => void; submitButton?: ReactNode }> {
	render() {
		return (
			<section className='search-bar'>
				<input className='input-bar' type='text' placeholder='Search' value={this.props.value} onChange={this.props.onChange} />
				{this.props.submitButton}
			</section>
		);
	}
}
