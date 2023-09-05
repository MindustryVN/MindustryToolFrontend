import React from 'react';

interface LikeCountProps {
	count: number;
}

export default function LikeCount({ count }: LikeCountProps) {
	if (count > 0) return <span className='flex w-8 h-8 justify-center items-center border-slate-500 border-2 rounded-lg bg-green-500'>{count}</span>;
	if (count < 0) return <span className='flex w-8 h-8 justify-center items-center border-slate-500 border-2 rounded-lg bg-red-500'>{count}</span>;
	return <span className='flex w-8 h-8 justify-center items-center border-slate-500 border-2 rounded-lg'>{count}</span>;
}
