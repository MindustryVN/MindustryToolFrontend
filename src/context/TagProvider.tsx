import React, { ReactNode, useEffect } from 'react';
import { Tags } from 'src/components/tag/Tag';

interface TagProviderProps {
	children: ReactNode;
}

export default function TagProvider(props: TagProviderProps) {
	useEffect(() => {
		Tags.getTag('schematic-upload-tag', Tags.SCHEMATIC_UPLOAD_TAG);
		Tags.getTag('schematic-search-tag', Tags.SCHEMATIC_SEARCH_TAG);
		Tags.getTag('map-upload-tag', Tags.MAP_UPLOAD_TAG);
		Tags.getTag('map-search-tag', Tags.MAP_SEARCH_TAG);
		Tags.getTag('post-upload-tag', Tags.POST_UPLOAD_TAG);
		Tags.getTag('post-search-tag', Tags.POST_SEARCH_TAG);
	}, []);

	return <>{props.children}</>;
}
