import React, { ReactNode } from 'react';

const COLOR_REGEX = /\[([^\]]+)\]/g;

interface ColorTextProps {
	text: string;
	className?: string;
}

export default function ColorText(props: ColorTextProps) {
	let result: ReactNode[] = [];
	let text = props.text;
	
    if (!text) return <></>;

	let index = text.search(COLOR_REGEX);

	let key = 0;

	if (index < 0) return <span className={props.className ? props.className : ''}>{text}</span>;

	if (index !== 0) {
		add(<span key={key}>{text.substring(0, index)}</span>);
		text = text.substring(index);
	}

	let arr = text.match(COLOR_REGEX);

	if (!arr) return <span className={props.className ? props.className : ''}>{result}</span>;

	const s = new Option().style;

	while (arr.length > 0) {
		let color = arr[0];
		color = color.substring(1, color.length - 1); // @ts-ignore

		if (color.includes('#')) {
			color = color.padEnd(7, '0');
		}
		s.color = color;

		if (arr.length < 2) {
			add(
				<span key={key} style={{ color: s.color }}>
					{text.substring(arr[0].length)}
				</span>,
			);
			break;
		}

		var nextIndex = text.indexOf(arr[1]);

		if (s.color !== '')
			add(
				<span key={key} style={{ color: s.color }}>
					{text.substring(arr[0].length, nextIndex)}
				</span>,
			);
		else add(<span key={key}>{text.substring(0, nextIndex)}</span>);

		text = text.substring(nextIndex);
		arr.shift();
	}

	function add(val: ReactNode) {
		key += 1;
		result.push(val);
	}

	return <span className={props.className ? props.className : ''}>{result}</span>;
}
