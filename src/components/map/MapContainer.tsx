import './MapContainer.css';

import React from 'react';

interface MapContainerProps {
	children: React.ReactNode;
}

export default function MapContainer(props: MapContainerProps) {
	return <section className='schematic-container'>{props.children}</section>;
}
