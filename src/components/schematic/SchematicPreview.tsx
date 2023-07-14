import './SchematicPreview.css';
import 'src/styles.css';

import React, { ReactNode } from 'react';
import SchematicData from './SchematicData';
import ColorText from 'src/components/common/ColorText';
import SchematicPreviewImage from 'src/components/schematic/SchematicPreviewImage';

interface SchematicPreviewProps {
	schematic: SchematicData;
	buttons: ReactNode;
	imageUrl: string;
	onClick: (schematic: SchematicData) => void;
}

export default function SchematicPreview(props: SchematicPreviewProps) {
	return (
		<section className="schematic-preview">
			<SchematicPreviewImage src={props.imageUrl} onClick={() => props.onClick(props.schematic)} />
			<ColorText className="capitalize small-padding flex-center text-center" text={props.schematic.name} />
			<section className="grid-row small-gap small-padding">{props.buttons}</section>
		</section>
	);
}
