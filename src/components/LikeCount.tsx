import React from 'react';
import { cn } from 'src/util/Utils';

interface LikeCountProps {
	className?: string;
	count: number;
}

export default function LikeCount({ className, count }: LikeCountProps) {
	return (
		<span
			className={cn('flex justify-center items-center border-slate-500 border-2 rounded-lg', className, {
				'bg-red-500': count < 0,
				'bg-green-500': count > 0,
			})}>
			{count}
		</span>
	);
}
