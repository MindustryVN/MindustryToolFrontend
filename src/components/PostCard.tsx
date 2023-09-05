import React, { ReactNode } from 'react';

interface PostCardProps {
	children: ReactNode;
}

export default function PostCard({ children }: PostCardProps) {
	return <section className='flex flex-row big-padding gap-2'>{children}</section>;
}
