import SecureImage from 'src/components/common/SecureImage';
import './SchematicInfoImage.css';

import React from 'react';

interface SchematicInfoImageProps {
	src: string;
}

export default function SchematicInfoImage(props: SchematicInfoImageProps) {
	return <SecureImage className='schematic-info-image' url={props.src} alt='schematic' />;
}
