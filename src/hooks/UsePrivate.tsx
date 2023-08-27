import { useMe } from 'src/context/MeProvider';

export default function usePrivate() {
	const { me } = useMe();

	return (request: () => any) => {
		if (me) return request();
	};
}
