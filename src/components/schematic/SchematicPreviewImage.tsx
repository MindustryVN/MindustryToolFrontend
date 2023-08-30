import ClearButton from 'src/components/button/ClearButton';
import './SchematicPreviewImage.css';

import React from 'react';

interface SchematicPreviewImageProps {
	src: string;
	onClick: () => void;
}

export default function SchematicPreviewImage(props: SchematicPreviewImageProps) {
	return (
		<ClearButton className='schematic-image-wrapper' onClick={() => props.onClick()}>
			<img className='schematic-preview-image' src={props.src} alt='schematic' />
		</ClearButton>
	);
}
