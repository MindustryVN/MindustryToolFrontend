import '../../../styles.css';

import React, { Component, ReactNode } from 'react';

export default class ScrollToTopButton extends Component {
	scrollToTop() {
		window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
	}

	render() {
		return (
			<button className='button' type='button' onClick={() => this.scrollToTop()}>
				Scroll to top
			</button>
		);
	}
}
