import useUser from 'src/hooks/UseUser';

export default function usePrivate() {
	const { user } = useUser();

	return (request: () => any) => {
		if (user) return request();
	};
}
