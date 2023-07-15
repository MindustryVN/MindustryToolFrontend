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

	if (index < 0) return <div className={props.className ? props.className : ''}>{text}</div>;

	if (index !== 0) {
		add(<div key={key}>{text.substring(0, index)}</div>);
		text = text.substring(index);
	}

	let arr = text.match(COLOR_REGEX);

	if (!arr) return <div className={props.className ? props.className : ''}>{result}</div>;

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
				<div key={key} style={{ color: s.color }}>
					{text.substring(arr[0].length)}
				</div>,
			);
			break;
		}

		var nextIndex = text.indexOf(arr[1]);

		if (s.color !== '')
			add(
				<div key={key} style={{ color: s.color }}>
					{text.substring(arr[0].length, nextIndex)}
				</div>,
			);
		else add(<div key={key}>{text.substring(0, nextIndex)}</div>);

		text = text.substring(nextIndex);
		arr.shift();
	}

	function add(val: ReactNode) {
		key += 1;
		result.push(val);
	}

	return <div className={props.className ? props.className : ''}>{result}</div>;
}
