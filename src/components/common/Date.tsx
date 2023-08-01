import React from 'react';

interface DateDisplayProps {
	time: string;
}

export default function DateDisplay(props: DateDisplayProps) {
	return <>{new Date(props.time).toLocaleString('en-GB')};</>;
}
