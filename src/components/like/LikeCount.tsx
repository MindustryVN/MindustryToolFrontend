import './LikeCount.css';

import React from 'react';

interface LikeCountProps {
	count: number;
}

export default function LikeCount(props: LikeCountProps) {
	if (props.count > 0) return <span className='count positive-count'>{props.count}</span>;
	if (props.count < 0) return <span className='count negative-count'>{props.count}</span>;
	return <span className='count'>{props.count}</span>;
}
