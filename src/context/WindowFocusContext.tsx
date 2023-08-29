import React, { useState, useEffect, ReactNode, useContext } from 'react';

export const WindowContext = React.createContext({ windowIsFocus: true });

export default function useWindowFocus() {
	return useContext(WindowContext);
}

export const WindowContextProvider = (props: { children: ReactNode }) => {
	const [windowIsFocus, setWindowIsFocus] = useState(true);

	function handleActivity(forcedFlag: any) {
		if (typeof forcedFlag === 'boolean') {
			return forcedFlag ? setWindowIsFocus(true) : setWindowIsFocus(false);
		}

		return document.hidden ? setWindowIsFocus(false) : setWindowIsFocus(true);
	}

	useEffect(() => {
		const handleActivityFalse = () => handleActivity(false);
		const handleActivityTrue = () => handleActivity(true);

		document.addEventListener('visibilitychange', handleActivity);
		document.addEventListener('blur', handleActivityFalse);
		window.addEventListener('blur', handleActivityFalse);
		window.addEventListener('focus', handleActivityTrue);
		document.addEventListener('focus', handleActivityTrue);

		return () => {
			window.removeEventListener('blur', handleActivity);
			document.removeEventListener('blur', handleActivityFalse);
			window.removeEventListener('focus', handleActivityFalse);
			document.removeEventListener('focus', handleActivityTrue);
			document.removeEventListener('visibilitychange', handleActivityTrue);
		};
	}, []);

	return <WindowContext.Provider value={{ windowIsFocus }}>{props.children}</WindowContext.Provider>;
};
