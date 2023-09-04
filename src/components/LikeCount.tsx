import React from 'react';

interface LikeCountProps {
	count: number;
}

export default function LikeCount(props: LikeCountProps) {
	if (props.count > 0) return <span className='flex w-8 h-8 justify-center items-center border-slate-500 border-2 rounded-lg bg-green-500'>{props.count}</span>;
	if (props.count < 0) return <span className='flex w-8 h-8 justify-center items-center border-slate-500 border-2 rounded-lg bg-red-500'>{props.count}</span>;
	return <span className='flex w-8 h-8 justify-center items-center border-slate-500 border-2 rounded-lg'>{props.count}</span>;
}
