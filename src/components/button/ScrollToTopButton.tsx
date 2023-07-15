import { Trans } from 'react-i18next';
import 'src/styles.css';

import React from 'react';
import Button from 'src/components/button/Button';
import i18n from 'src/util/I18N';

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
		<Button title={i18n.t('scroll-to-top').toString()} onClick={() => scrollToTop()}>
			<Trans i18nKey='scroll-to-top' />
		</Button>
	);
}
