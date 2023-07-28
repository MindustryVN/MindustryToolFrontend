import { Buffer } from 'buffer';
export class Utils {
	static getDownloadUrl(data: string): string {
		const blob = new Blob([Buffer.from(Buffer.from(data, 'base64').toString(), 'base64')], {
			type: 'octet/stream',
		});
		return window.URL.createObjectURL(blob);
	}

	static array2dToArray1d<T>(arr2d: T[][]) {
		const arr: T[] = [];

		for (let i = 0; i < arr2d.length; i++)
			for (let j = 0; j < arr2d[i].length; j++) {
				arr.push(arr2d[i][j]);
			}

		return arr;
	}

	static getUrlParam(name: string): string {
		name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
		var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');

		var results = regex.exec(window.location.search);
		return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
	}
}
