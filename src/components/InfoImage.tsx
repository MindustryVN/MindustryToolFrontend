import React from 'react';

interface InfoImageProps {
	src: string;
}

export default function InfoImage({ src }: InfoImageProps) {
	return <img className='rounded-lg border-slate-500 min-w-[var(--preview-image-min-size)] min-h-[var(--preview-image-min-size)] max-w-[ min(512px, 80vw)] self-start' src={src} alt='schematic' />;
}
