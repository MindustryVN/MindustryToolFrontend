import './SchematicPreviewCard.css';
import 'src/styles.css';

import React, { ReactNode } from 'react';

interface SchematicPreviewCardProps {
	children: ReactNode;
}

export default function SchematicPreviewCard(props: SchematicPreviewCardProps) {
	return <section className='schematic-preview-card'>{props.children}</section>;
}
