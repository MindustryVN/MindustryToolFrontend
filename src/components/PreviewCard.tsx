import React, { ReactNode } from 'react';

interface PreviewCardProps extends React.ClassAttributes<HTMLElement> {
	className?: string;
	children: ReactNode;
}

export default function PreviewCard(props: PreviewCardProps) {
	return (
		<section className={`w-[var(--preview-image-min-size)] rounded-lg overflow-hidden border-slate-500 border-2 flex flex-col justify-between ${props.className ? props.className : ''}`}>
			{props.children}
		</section>
	);
}
