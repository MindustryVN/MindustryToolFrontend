import './SchematicInfoImage.css';

import React from 'react';

interface SchematicInfoImageProps {
	src: string;
}

export default function SchematicInfoImage(props: SchematicInfoImageProps) {
	return <img className='schematic-info-image' src={props.src} alt='schematic' />;
}
