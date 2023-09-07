import { Buffer } from 'buffer';
import { twMerge } from 'tailwind-merge';
import { clsx, ClassValue } from 'clsx';

export function getDownloadUrl(data: string): string {
	const blob = new Blob([Buffer.from(Buffer.from(data, 'base64').toString(), 'base64')], {
		type: 'octet/stream',
	});
	return window.URL.createObjectURL(blob);
}

export function array2dToArray1d<T>(arr2d: T[][]) {
	const arr: T[] = [];

	for (let i = 0; i < arr2d.length; i++)
		for (let j = 0; j < arr2d[i].length; j++) {
			arr.push(arr2d[i][j]);
		}

	return arr;
}

export function getUrlParam(name: string): string {
	name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
	var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');

	var results = regex.exec(window.location.search);
	return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

export function cn(...props: ClassValue[]) {
	return twMerge(clsx(props));
}
