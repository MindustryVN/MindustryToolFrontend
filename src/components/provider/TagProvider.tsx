import '../../styles.css';

import React, { ReactNode, useEffect } from 'react';
import { TagChoiceLocal } from '../tag/Tag';

interface TagProviderProps {
	children: ReactNode;
}

export default function TagProvider(props: TagProviderProps) {
	useEffect(() => {
		TagChoiceLocal.getTag('schematic-upload-tag', TagChoiceLocal.SCHEMATIC_UPLOAD_TAG);
		TagChoiceLocal.getTag('schematic-search-tag', TagChoiceLocal.SCHEMATIC_SEARCH_TAG);
	}, []);

	return <section className="h100p w100p">{props.children}</section>;
}
