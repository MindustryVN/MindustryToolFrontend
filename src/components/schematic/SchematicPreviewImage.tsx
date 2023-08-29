import ClearButton from 'src/components/button/ClearButton';
import './SchematicPreviewImage.css';

import React from 'react';
import SecureImage from 'src/components/common/SecureImage';

interface SchematicPreviewImageProps {
	src: string;
	onClick: () => void;
}

export default function SchematicPreviewImage(props: SchematicPreviewImageProps) {
	return (
		<ClearButton className='schematic-image-wrapper' onClick={() => props.onClick()}>
			<SecureImage className='schematic-preview-image' url={props.src} alt='schematic' />
		</ClearButton>
	);
}
