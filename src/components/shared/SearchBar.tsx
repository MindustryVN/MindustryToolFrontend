import './SearchBar.css';

import React, { ReactNode } from 'react';

export default class SearchBar extends React.Component<{ placeholder: string; value: string; onChange: (event: React.ChangeEvent<HTMLInputElement>) => void; submitButton?: ReactNode }> {
	render() {
		return (
			<div className='search-bar-container'>
				<input className='search-bar' type='text' placeholder='Search' value={this.props.value} onChange={this.props.onChange} />
				{this.props.submitButton}
			</div>
		);
	}
}
