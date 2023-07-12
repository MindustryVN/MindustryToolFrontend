import './SchematicPreview.css';
import '../../styles.css';

import React, { ReactNode } from 'react';
import SchematicData from './SchematicData';

interface SchematicPreviewProps {
	schematic: SchematicData;
	buttons: ReactNode;
	imageUrl: string;
	onClick: (schematic: SchematicData) => void;
}

export default function SchematicPreview(props: SchematicPreviewProps) {
	return (
		<section className="schematic-preview">
			<button className="schematic-image-wrapper" type="button" onClick={() => props.onClick(props.schematic)}>
				<img className="schematic-image" src={props.imageUrl} alt="schematic" />
			</button>

			<span className="schematic-name small-padding flex-center text-center">{props.schematic.name}</span>

			<section className="grid-row small-gap small-padding">{props.buttons}</section>
		</section>
	);
}
