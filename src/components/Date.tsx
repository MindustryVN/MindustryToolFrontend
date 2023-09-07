import React from 'react';

interface DateDisplayProps {
	className?: string;
	time: string;
}

export default function DateDisplay({ className, time }: DateDisplayProps) {
	return <span className={className ? className : ''}>{new Date(time).toLocaleString('en-GB')}</span>;
}
