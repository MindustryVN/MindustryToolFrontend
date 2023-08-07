import './SchematicPreviewCard.css';
import 'src/styles.css';

import React, { ReactNode } from 'react';

interface SchematicPreviewCardProps extends React.ClassAttributes<HTMLElement> {
	className?: string;
	children: ReactNode;
}

export default function SchematicPreviewCard(props: SchematicPreviewCardProps) {
	return <section className={`schematic-preview-card ${props.className ? props.className : ''}`}>{props.children}</section>;
}
