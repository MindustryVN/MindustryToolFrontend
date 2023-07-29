import './MapPreviewImage.css';

import React from 'react';

interface MapPreviewImageProps {
	src: string;
	onClick: () => void;
}

export default function MapPreviewImage(props: MapPreviewImageProps) {
	return (
		<button className='map-preview-image-card' type='button' onClick={() => props.onClick()}>
			<section className='map-preview-image-wrapper'>
				<img className='map-preview-image' src={props.src} alt='map' />
			</section>
		</button>
	);
}
