export default interface MindustryServer {
	name: string;
	online: boolean;
	address: string;
	mapname: string;
	description: string;
	wave: number;
	players: number;
	playerLimit: number;
	version: number;
	versionType: string;
	mode: string;
	modeName: string;
	ping: number;
	port: number;
	time: string;
}
