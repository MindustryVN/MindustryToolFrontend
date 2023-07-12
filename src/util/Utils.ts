import { Buffer } from 'buffer';
export class Utils {
	static getDownloadUrl(data: string): string {
		const blob = new Blob([Buffer.from(data, 'base64')], {
			type: 'text/plain',
		});
		return window.URL.createObjectURL(blob);
	}

	static copyDataToClipboard(str: string) {
		return navigator.clipboard.writeText(str);
	}

	static array2dToArray<ArrayType, ResultType>(arr2d: ArrayType[][], func: (item: ArrayType, index?: number) => ResultType): ResultType[] {
		const arr: ResultType[] = [];

		for (let i = 0; i < arr2d.length; i++)
			for (let j = 0; j < arr2d[i].length; j++) {
				arr.push(func(arr2d[i][j], i * arr2d[0].length + j));
			}

		return arr;
	}
}
