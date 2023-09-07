import React, { ReactNode, useContext, useEffect, useRef, useState } from 'react';
import User from 'src/data/User';
import { ACCESS_TOKEN } from 'src/config/Config';
import { API } from 'src/API';
import { PopupMessageContext } from 'src/context/PopupMessageProvider';
import i18n from 'src/util/I18N';

interface MeContextProps {
	me: User | undefined;
	loading: boolean;
	handleLogout: () => void;
}

export const MeContext = React.createContext<MeContextProps>({
	me: undefined,
	loading: false,
	handleLogout: () => {},
});

export function useMe() {
	return useContext(MeContext);
}

interface MeProviderProps {
	children: ReactNode;
}

export default function MeProvider({ children }: MeProviderProps) {
	const [me, setMe] = useState<User>();
	const [loading, setLoading] = useState<boolean>(true);

	const ref = useRef(useContext(PopupMessageContext));

	useEffect(() => {
		setLoading(true);
		let accessToken = localStorage.getItem(ACCESS_TOKEN);
		if (accessToken) {
			API.setBearerToken(accessToken);
			API.getMe() //
				.then((result) => {
					let user: User = result.data;
					setMe(user);
					console.log('Logged as ' + user.name);
				})
				.catch((error) => {
					ref.current.addPopup(i18n.t('login-fail'), 5, 'error');
					console.log(error);
				})
				.finally(() => setLoading(false));
		} else setLoading(false);
	}, []);

	function handleLogOut() {
		setMe(undefined);
		localStorage.removeItem(ACCESS_TOKEN);
	}

	return <MeContext.Provider value={{ me: me, loading: loading, handleLogout: handleLogOut }}>{children}</MeContext.Provider>;
}
