import '../../../styles.css';

import React, { Component } from 'react';

export default class ScrollToTopButton extends Component<{ container: string }> {
	scrollToTop() {
		let container = document.getElementById(this.props.container);
		if (container) container.scrollTo({ top: 0, behavior: 'smooth' });
		else throw new Error(`Container element is not found in ${this}`);
	}

	render() {
		return (
			<button className='button' type='button' onClick={() => this.scrollToTop()}>
				Scroll to top
			</button>
		);
	}
}
