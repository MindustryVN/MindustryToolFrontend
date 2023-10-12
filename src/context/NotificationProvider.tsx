import React, { useContext, useEffect, useState } from 'react';
import { API } from 'src/API';
import { useMe } from 'src/context/MeProvider';

interface NotificationContextProps {
	unreadNotifications: number;
	setUnreadNotifications: (action: (number: number) => number) => void;
}

export const NotificationContext = React.createContext<NotificationContextProps>({
	unreadNotifications: 0,
	setUnreadNotifications: (_: (number: number) => number) => {},
});

export function useNotification() {
	return useContext(NotificationContext);
}

interface NotificationProviderProps {
	children: React.ReactNode;
}

export default function NotificationProvider({ children }: NotificationProviderProps) {
	const { me } = useMe();

	const [unreadNotifications, setUnreadNotifications] = useState(0);

	useEffect(() => {
		if (me) {
			API.getUnreadNotification() //
				.then((result) => setUnreadNotifications(result.data))
				.catch(() => console.log('Fail to get unread notification count'));

			let id: any = setInterval(() => {
				API.getUnreadNotification() //
					.then((result) => setUnreadNotifications(result.data))
					.catch(() => console.log('Fail to get unread notification count'));

				return clearInterval(id);
			}, 60000);
		}
	}, [me]);

	return <NotificationContext.Provider value={{ unreadNotifications, setUnreadNotifications }}>{children}</NotificationContext.Provider>;
}
