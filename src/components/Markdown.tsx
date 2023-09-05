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
		<a href={href} target='_blank' rel='noreferrer'>
			{children}
		</a>
	) : (
		<Link to={href}>{children}</Link>
	);
}

function MarkdownImage({ src, alt }: any) {
	return <img className='markdown-image' src={src} alt={alt} />;
}

export default function Markdown({ className, children }: MarkdownProps) {
	return (
		<ReactMarkdown className={cn(className)} components={{ link: RouterLink, img: MarkdownImage }}>
			{children}
		</ReactMarkdown>
	);
}
