import './ScrollToTopButton.css';
import 'src/styles.css';

import React from 'react';
import i18n from 'src/util/I18N';
import { ArrowUpCircle } from 'src/components/common/Icon';
import ClearButton from 'src/components/button/ClearButton';

interface ScrollToTopButtonProps {
	//id of the container
	containerId: string;
}

export default function ScrollToTopButton(props: ScrollToTopButtonProps) {
	function scrollToTop() {
		let container = document.getElementById(props.containerId);
		if (container) container.scrollTo({ top: 0, behavior: 'smooth' });
		else console.log(`Container element is not found with id ${props}`);
	}

	return (
		<ClearButton className='scroll-to-top-button' title={i18n.t('scroll-to-top').toString()} onClick={() => scrollToTop()}>
			<ArrowUpCircle />
		</ClearButton>
	);
}
