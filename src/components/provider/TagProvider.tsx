import 'src/styles.css';

import React, { ReactNode, useEffect } from 'react';
import { Tags } from 'src/components/tag/Tag';

interface TagProviderProps {
	children: ReactNode;
}

export default function TagProvider(props: TagProviderProps) {
	useEffect(() => {
		Tags.getTag('schematic-upload-tag', Tags.SCHEMATIC_UPLOAD_TAG);
		Tags.getTag('schematic-search-tag', Tags.SCHEMATIC_SEARCH_TAG);
	}, []);

	return <section className='h100p w100p'>{props.children}</section>;
}
