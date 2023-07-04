import '../../../styles.css';

import React from 'react';
import IconButton from './IconButton';

interface ScrollToTopButtonParam {
	//id of the container
	containerId: string;
}

export default function ScrollToTopButton(param: ScrollToTopButtonParam) {
	function scrollToTop() {
		let container = document.getElementById(param.containerId);
		if (container) container.scrollTo({ top: 0, behavior: 'smooth' });
		else throw new Error(`Container element is not found with id ${param}`);
	}

	return (
		<button className='button' type='button' onClick={() => scrollToTop()}>
			Scroll to top
		</button>
	);
}
