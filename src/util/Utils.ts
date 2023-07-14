import { Buffer } from 'buffer';
export class Utils {
	static getDownloadUrl(data: string): string {
		const blob = new Blob([Buffer.from(data, 'base64')], {
			type: 'text/plain',
		});
		return window.URL.createObjectURL(blob);
	}

	static array2dToArray1d<T>(arr2d : T[][]){
		const arr: T[] = [];

		for (let i = 0; i < arr2d.length; i++)
			for (let j = 0; j < arr2d[i].length; j++) {
				arr.push(arr2d[i][j]);
			}

		return arr;
	}
}
