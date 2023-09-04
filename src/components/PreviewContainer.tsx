import React from 'react';

interface PreviewContainerProps {
	children: React.ReactNode;
}

export default function PreviewContainer(props: PreviewContainerProps) {
	return <section className='grid grid-cols-[repeat(auto-fill,var(--preview-image-min-size))] gap-4 justify-center items-start'>{props.children}</section>;
}
