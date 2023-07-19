import useUser from 'src/hooks/UseUser';

export default function usePrivate() {
	const { user } = useUser();

	return (request: () => void) => {
		if (user) request();
	};
}
