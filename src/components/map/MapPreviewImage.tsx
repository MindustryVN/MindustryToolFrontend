import './MapPreviewImage.css';

import React from 'react';

interface MapPreviewImageProps {
	src: string;
	onClick: () => void;
}

export default function MapPreviewImage(props: MapPreviewImageProps) {
	return (
		<button className='map-image-wrapper' type='button' onClick={() => props.onClick()}>
			<img className='map-preview-image' src={props.src} alt='map' />
		</button>
	);
}
