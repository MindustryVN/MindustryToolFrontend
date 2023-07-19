import React, { ReactNode, useContext, useEffect, useRef, useState } from 'react';
import User from 'src/data/User';
import { ACCESS_TOKEN } from 'src/config/Config';
import { API } from 'src/API';
import { PopupMessageContext } from 'src/context/PopupMessageProvider';
import i18n from 'src/util/I18N';

interface UserContextProps {
	user: User | undefined;
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
	const [user, setUser] = useState<User>();
	const [loading, setLoading] = useState<boolean>(true);

	const ref = useRef(useContext(PopupMessageContext));

	useEffect(() => {
		setLoading(true);
		let accessToken = localStorage.getItem(ACCESS_TOKEN);
		if (accessToken) {
			API.setBearerToken(accessToken);
			API.REQUEST.get('/user/me') //
				.then((result) => setUser(result.data))
				.catch(() => ref.current.addPopup(i18n.t('login-fail'), 5, 'error'))
				.finally(() => setLoading(false));
		} else setLoading(false);
	}, []);

	function handleLogOut() {
		setUser(undefined);
		localStorage.removeItem(ACCESS_TOKEN);
	}

	return <UserContext.Provider value={{ user: user, loading: loading, handleLogout: handleLogOut }}>{props.children}</UserContext.Provider>;
}
