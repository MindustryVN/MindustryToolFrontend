import React from 'react';
import { cn } from 'src/util/Utils';

interface SwitchBarProps {
	className?: string;
	children: React.ReactNode;
}

export default function SwitchName({ className, children }: SwitchBarProps) {
	return <div className={cn('flex flex-row items-center justify-end gap-1', className)}>{children}</div>;
}
