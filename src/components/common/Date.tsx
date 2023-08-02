import React from 'react';

interface DateDisplayProps {
	className?: string;
	time: string;
}

export default function DateDisplay(props: DateDisplayProps) {
	return <span className={props.className ? props.className : ''}>{new Date(props.time).toLocaleString('en-GB')}</span>;
}
