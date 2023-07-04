import './SchematicPreview.css';
import '../../../styles.css';

import React, { ReactNode } from 'react';
import SchematicData from './SchematicData';
import { API_BASE_URL } from '../../../config/Config';

interface SchematicPreviewParam {
	schematic: SchematicData;
	buttons: ReactNode;
	onClick: (schematic: SchematicData) => void;
}

export default function SchematicPreview(param: SchematicPreviewParam) {
	return (
		<section className='schematic-preview'>
			<button className='schematic-image-wrapper' type='button' onClick={() => param.onClick(param.schematic)}>
				<img className='schematic-image' src={`${API_BASE_URL}schematic/${param.schematic.id}/image`} />
			</button>

			<span className='schematic-name small-padding flex-center text-center'>{param.schematic.name}</span>

			<section className='grid-row small-gap small-padding'>{param.buttons}</section>
		</section>
	);
}
