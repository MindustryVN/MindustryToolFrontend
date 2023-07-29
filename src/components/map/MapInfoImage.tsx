import './MapInfoImage.css';

import React from 'react';

interface MapInfoImageProps {
	src: string;
}

export default function MapInfoImage(props: MapInfoImageProps) {
	return (
		<section className='map-info-image-wrapper'>
			<img className='map-info-image' src={`${props.src}`} alt='map' />
		</section>
	);
}
