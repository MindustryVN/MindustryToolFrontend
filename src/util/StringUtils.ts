export function getFileExtension(file: File) {
	let extension = file.name.split('.').pop();
	return extension ? extension : '';
}

export function isString<T, F>(x: any, whenTrue: (str: string) => T, whenFalse: (x: any) => F) {
	if (Object.prototype.toString.call(x) === '[object String]') return whenTrue(String(x));
	else return whenFalse(x);
}
