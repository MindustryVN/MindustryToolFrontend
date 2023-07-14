import './SchematicContainer.css';

import React from 'react';

interface SchematicContainerProps {
	children: React.ReactNode;
}

export default function SchematicContainer(props: SchematicContainerProps) {
	return <section className='schematic-container'>{props.children}</section>;
}
