import '../../styles.css'

import React, { ReactNode, useEffect } from 'react';
import { TagChoice } from '../tag/Tag';

interface TagProviderProps {
	children: ReactNode;
}

export default function TagProvider(props: TagProviderProps) {
	useEffect(() => {
		TagChoice.getTag('schematic-upload-tag', TagChoice.SCHEMATIC_UPLOAD_TAG);
		TagChoice.getTag('schematic-search-tag', TagChoice.SCHEMATIC_SEARCH_TAG);
	}, []);

	return <section className='h100p w100p'>{props.children}</section>;
}
