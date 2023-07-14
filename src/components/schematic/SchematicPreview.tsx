import './SchematicPreview.css';
import 'src/styles.css';

import React, { ReactNode } from 'react';

interface SchematicPreviewProps {
	children: ReactNode;
}

export default function SchematicPreview(props: SchematicPreviewProps) {
	return <section className='schematic-preview'>{props.children}</section>;
}
