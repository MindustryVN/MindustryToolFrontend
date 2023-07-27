import './MapPreviewCard.css';
import 'src/styles.css';

import React, { ReactNode } from 'react';

interface MapPreviewCardProps {
	className?: string;
	children: ReactNode;
}

export default function MapPreviewCard(props: MapPreviewCardProps) {
	return <section className={`map-preview-card ${props.className ? props.className : ''}`}>{props.children}</section>;
}
