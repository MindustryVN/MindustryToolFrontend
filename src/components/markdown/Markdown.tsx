import './Markdown.css';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';

interface MarkdownProps {
	className?: string;
	children: string;
}

//Hack
function RouterLink(props: any) {
	return props.href.match(/^(https?:)?\/\//) ? <a href={props.href}>{props.children}</a> : <Link to={props.href}>{props.children}</Link>;
}

function MarkdownImage(props: any) {
	return <img className='markdown-image' src={props.src} alt={props.alt} />;
}

export default function Markdown(props: MarkdownProps) {
	return (
		<ReactMarkdown className={props.className} components={{ link: RouterLink, img: MarkdownImage }}>
			{props.children}
		</ReactMarkdown>
	);
}
