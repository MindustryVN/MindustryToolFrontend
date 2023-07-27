import './MapInfoImage.css';

import React from 'react';

interface MapInfoImageProps {
	src: string;
}

export default function MapInfoImage(props: MapInfoImageProps) {
	return <img className='map-info-image' src={`${props.src}`} alt='map' />;
}
