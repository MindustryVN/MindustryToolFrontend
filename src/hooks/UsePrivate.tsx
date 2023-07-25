import useMe from 'src/hooks/UseMe';

export default function usePrivate() {
	const { me } = useMe();

	return (request: () => any) => {
		if (me) return request();
	};
}
