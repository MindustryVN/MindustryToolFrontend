import React from 'react';
import { cn } from 'src/util/Utils';

interface DateDisplayProps {
	className?: string;
	time: string;
}

export default function DateDisplay({ className, time }: DateDisplayProps) {
	return <span className={cn(className)}>{new Date(time).toLocaleString('en-GB')}</span>;
}
