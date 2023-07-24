import React, { useEffect, useState } from 'react';
import { API } from 'src/API';
import useUser from 'src/hooks/UseUser';

interface NotificationContextProps {
	unreadNotifications: number;
	setUnreadNotifications: (action: (number: number) => number) => void;
}

export const NotificationContext = React.createContext<NotificationContextProps>({
	unreadNotifications: 0,
	setUnreadNotifications: (_: (number: number) => number) => {},
});

interface NotificationProviderProps {
	children: React.ReactNode;
}

export default function NotificationProvider(props: NotificationProviderProps) {
	const { user } = useUser();

	const [unreadNotifications, setUnreadNotifications] = useState(0);

	useEffect(() => {
		if (user)
			API.REQUEST.get('notification/unread') //
				.then((result) => setUnreadNotifications(result.data))
				.catch(() => console.log('Fail to get unread notification count'));
	}, [user]);

	return (
		<NotificationContext.Provider
			value={{
				unreadNotifications: unreadNotifications, //
				setUnreadNotifications: setUnreadNotifications,
			}}>
			{props.children}
		</NotificationContext.Provider>
	);
}
