import React from 'react';

interface PostTitleProps {
	title: string;
}

export default function PostTitle({ title }: PostTitleProps) {
	return <span className='text-xl'>{title}</span>;
}
