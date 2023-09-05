import React from 'react';
import i18n from 'src/util/I18N';
import ClearButton from 'src/components/ClearButton';

interface ScrollToTopButtonProps {
	//id of the container
	containerId: string;
}

export default function ScrollToTopButton({ containerId }: ScrollToTopButtonProps) {
	function scrollToTop() {
		let container = document.getElementById(containerId);
		if (container) container.scrollTo({ top: 0, behavior: 'smooth' });
		else console.log(`Container element is not found with id ${containerId}`);
	}

	return (
		<ClearButton className='fixed bottom-0 right-0' title={i18n.t('scroll-to-top').toString()} onClick={() => scrollToTop()}>
			<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='h-10 w-10'>
				<path strokeLinecap='round' fill='black' stroke='white' strokeLinejoin='round' d='M15 11.25l-3-3m0 0l-3 3m3-3v7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
			</svg>
		</ClearButton>
	);
}
