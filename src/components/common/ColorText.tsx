import React, { ReactNode } from 'react';

const COLOR_REGEX = /\[([^\]]+)\]/g;

interface ColorTextProps {
	text: string;
	className?: string;
}

export default function ColorText(props: ColorTextProps) {
	let text = props.text;

	if (!text) return <></>;

	let index = text.search(COLOR_REGEX);
	let key = 0;

	if (index < 0) return <div className={props.className ? props.className : ''}>{text}</div>;

	let result: ReactNode[] = [];

	if (index !== 0) {
		add(text.substring(0, index), 'white');
		text = text.substring(index);
	}

	let arr = text.match(COLOR_REGEX);

	if (!arr) return <div className={props.className ? props.className : ''}>{text}</div>;

	const s = new Option().style;

	while (arr.length > 0) {
		let color = arr[0];
		color = color.substring(1, color.length - 1); // @ts-ignore

		if (color.includes('#')) {
			color = color.padEnd(7, '0');
		}
		s.color = color;

		if (arr.length < 2) {
			add(text.substring(arr[0].length), s.color);
			break;
		}

		var nextIndex = text.indexOf(arr[1]);

		if (s.color !== '') add(text.substring(arr[0].length, nextIndex), s.color);
		else add(text.substring(0, nextIndex), s.color);

		text = text.substring(nextIndex);
		arr.shift();
	}

	function add(text: string, color: string) {
		result.push(...breakdown(text, color));
	}

	function breakdown(text: string, color: string) {
		let s = text.split('\n');
		let r = [];
		key += 1;

		r.push(
			<span key={key} style={{ color: color }}>
				{s[0]}
			</span>,
		);

		for (let i = 1; i < s.length; i++) {
			key += 1;
			r.push(<br key={key} />);

			key += 1;
			r.push(
				<span key={key} style={{ color: color }}>
					{s[i]}
				</span>,
			);
		}
		return r;
	}

	return <span className={props.className ? props.className : ''}>{result}</span>;
}
