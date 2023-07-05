import '../../styles.css';

import React from 'react';
import IconButton from './IconButton';

interface ScrollToTopButtonProps {
	//id of the container
	containerId: string;
}

export default function ScrollToTopButton(props: ScrollToTopButtonProps) {
	function scrollToTop() {
		let container = document.getElementById(props.containerId);
		if (container) container.scrollTo({ top: 0, behavior: 'smooth' });
		else throw new Error(`Container element is not found with id ${props}`);
	}

	return (
		<button className='button' type='button' onClick={() => scrollToTop()}>
			Scroll to top
		</button>
	);
}
