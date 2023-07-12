import React, { ReactNode, useEffect, useState } from 'react';
import UserData from '../user/UserData';
import { ACCESS_TOKEN } from '../../config/Config';
import { API } from '../../API';

interface UserContextProps {
	user: UserData | undefined;
	loading: boolean;
	handleLogout: () => void;
}

export const UserContext = React.createContext<UserContextProps>({
	user: undefined,
	loading: false,
	handleLogout: () => {},
});

interface UserProviderProps {
	children: ReactNode;
}

export default function UserProvider(props: UserProviderProps) {
	const [user, setUser] = useState<UserData>();
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		setLoading(true);
		let accessToken = localStorage.getItem(ACCESS_TOKEN);
		if (accessToken) {
			API.setBearerToken(accessToken);
			API.REQUEST.get('/user/me') //
				.then((result) => setUser(result.data))
				.catch(() => console.log('Login fail'))
				.finally(() => setLoading(false));
		} else setLoading(false);
	}, []);

	function handleLogOut() {
		setUser(undefined);
		localStorage.removeItem(ACCESS_TOKEN);
	}

	return <UserContext.Provider value={{ user: user, loading: loading, handleLogout: handleLogOut }}>{props.children}</UserContext.Provider>;
}
