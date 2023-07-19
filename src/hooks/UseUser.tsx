import { useContext } from 'react';
import { UserContext } from 'src/context/UserProvider';

export default function useUser() {
	return useContext(UserContext);
}
