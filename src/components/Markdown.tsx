import './Markdown.css';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
import { cn } from 'src/util/Utils';

interface MarkdownProps {
	className?: string;
	children: string;
}

function RouterLink({ href, children }: any) {
	return href.match(/^(https?:)?\/\//) ? (
		<a className='text-emerald-500' href={href} target='_blank' rel='noreferrer'>
			{children}
		</a>
	) : (
		<Link to={href}>{children}</Link>
	);
}

function MarkdownImage({ src, alt }: any) {
	return <img className='markdown-image h-full w-full' src={src} alt={alt} />;
}

export default function Markdown({ className, children }: MarkdownProps) {
	return (
		<ReactMarkdown className={cn('prose lg:prose-xl', className)} components={{ a: RouterLink, img: MarkdownImage }}>
			{children}
		</ReactMarkdown>
	);
}
