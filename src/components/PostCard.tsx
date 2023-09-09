import React, { ReactNode } from 'react';

interface PostCardProps {
	children: ReactNode;
}

export default function PostCard({ children }: PostCardProps) {
	return <section className='flex flex-row justify-between gap-2 p-2'>{children}</section>;
}
