import { v4 } from 'uuid';
import ClearIconButton from '../button/ClearIconButton';
import { QUIT_ICON } from '../common/Icon';
import './AlertProvider.css';

import React, { ReactNode, useEffect } from 'react';
import { API } from '../../API';

type AlertType = 'info' | 'warning' | 'error';

interface AlertProps {
	message: ReactNode;
	duration: number;
	type: AlertType;
	uuid: string;
}

interface AlertContextProps {
	useAlert: (message: string, duration: number, type: AlertType) => void;
}

export const AlertContext = React.createContext<AlertContextProps>({ useAlert: (message: string, duration: number, type: AlertType) => {} });

interface AlertProviderProps {
	children: ReactNode;
}

export default function AlertProvider(props: AlertProviderProps) {
	const [message, setMessage] = React.useState<AlertProps[]>([]);

	useEffect(() => ping(), []);

	function addMessage(message: string, duration: number, type: AlertType) {
		let uuid: string = v4();
		let val: AlertProps = { message: message, duration: duration, uuid: uuid, type: type };
		setMessage((prev) => [val, ...prev]);
	}

	function removeMessage(id: string) {
		setMessage((prev) => [...prev.filter((val) => id !== val.uuid)]);
	}

	function ping() {
		const start = Date.now();
		API.REQUEST.get('ping') //
			.then(() => addMessage(`Ping: ${Date.now() - start}ms`, 5, 'info'));
	}

	return (
		<AlertContext.Provider value={{ useAlert: addMessage }}>
			<section id='alert-container' className='flex-column small-gap'>
				{message.map((val, index) => (
					<AlertMessage key={index} message={val.message} duration={val.duration} type={val.type} onTimeOut={() => removeMessage(val.uuid)} />
				))}
			</section>
			{props.children}
		</AlertContext.Provider>
	);
}

interface AlertMessageProps {
	message: ReactNode;
	duration: number;
	type: AlertType;
	onTimeOut: () => void;
}

function AlertMessage(props: AlertMessageProps) {
	setTimeout(() => props.onTimeOut(), props.duration * 1000);

	var color = '';

	switch (props.type) {
		case 'info':
			color = 'lightgreen';
			break;

		case 'warning':
			color = '#E9D502';
			break;

		case 'error':
			color = '#D0342C';
			break;
	}

	return (
		<section className='alert-message' style={{ backgroundColor: color }}>
			{props.message}
			<ClearIconButton icon={QUIT_ICON} onClick={() => props.onTimeOut()} />
		</section>
	);
}
