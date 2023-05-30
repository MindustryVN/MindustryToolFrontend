export function capitalize(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getFileExtension(file: File) {
	let extension = file.name.split('.').pop();
	return extension ? extension : '';
}
