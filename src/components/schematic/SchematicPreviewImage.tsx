import './SchematicPreviewImage.css';

import React from 'react';

interface SchematicPreviewImageProps {
	src: string;
	onClick: () => void;
}

export default function SchematicPreviewImage(props: SchematicPreviewImageProps) {
	return (
		<button className="schematic-image-wrapper" type="button" onClick={() => props.onClick()}>
			<img className="schematic-image" src={props.src} alt="schematic" />
		</button>
	);
}
