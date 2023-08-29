import SecureImage from 'src/components/common/SecureImage';
import './MapInfoImage.css';

import React from 'react';

interface MapInfoImageProps {
	src: string;
}

export default function MapInfoImage(props: MapInfoImageProps) {
	return (
		<section className='map-info-image-wrapper'>
			<SecureImage className='map-info-image' url={props.src} alt='map' />
		</section>
	);
}
