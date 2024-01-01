import React, { ReactNode } from 'react';
import { cn } from 'src/util/Utils';

interface PreviewCardProps {
	className?: string;
	children: ReactNode;
}

export default function PreviewCard({ className, children }: PreviewCardProps) {
	return <section className={cn(`w-[var(--preview-image-min-size)] animate-appear rounded-lg overflow-hidden border-slate-500 border flex flex-col justify-between `, className)}>{children}</section>;
}
