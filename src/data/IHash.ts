export interface IHash<T> {
	[key: string]: T;
}

export class Cache<T> {
	cache: IHash<T> = {};

	get(key: string, provider: () => T) {
		let d = this.cache[key];
		if (d) return d;

		d = provider();
		this.cache[key] = d;
		return d;
	}
}
