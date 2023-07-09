import './PopupMessageProvider.css';
import '../../styles.css';

import { v4 } from 'uuid';
import ClearIconButton from '../button/ClearIconButton';
import { QUIT_ICON } from '../common/Icon';

import React, { ReactNode, useEffect } from 'react';
import { API } from '../../API';

type PopupMessageType = 'info' | 'warning' | 'error';

interface PopupMessageData {
	message: ReactNode;
	duration: number;
	type: PopupMessageType;
	uuid: string;
}

interface PopupMessageProps {
	message: ReactNode;
	duration: number;
	type: PopupMessageType;
}

interface PopupMessageContextProps {
	addPopupMessage: (props: PopupMessageProps) => void;
}

export const PopupMessageContext = React.createContext<PopupMessageContextProps>({ addPopupMessage: (props: PopupMessageProps) => {} });

interface PopupMessageProviderProps {
	children: ReactNode;
}

export default function AlertProvider(props: PopupMessageProviderProps) {
	const [messages, setMessages] = React.useState<PopupMessageData[]>([]);

	useEffect(() => {
		const start = Date.now();
	
		function addMessage(props: PopupMessageProps) {
			let uuid: string = v4();
			let val: PopupMessageData = { message: props.message, duration: props.duration, uuid: uuid, type: props.type };
			setMessages((prev) => [val, ...prev]);
		}
	
		API.REQUEST.get('ping') //
			.then(() => addMessage({ message: `Ping: ${Date.now() - start}ms`, duration: 5, type: 'info' }))//
			.catch(() => addMessage({message: "message.lost-connection", duration: 5, type: 'info'}));
		
	}, []);

	function addMessage(props: PopupMessageProps) {
		let uuid: string = v4();
		let val: PopupMessageData = { message: props.message, duration: props.duration, uuid: uuid, type: props.type };
		setMessages([val, ...messages]);
	}

	function removeMessage(id: string) {
		setMessages((prev) => [...prev.filter((val) => id !== val.uuid)]);
	}

	return (
		<PopupMessageContext.Provider value={{ addPopupMessage: addMessage }}>
			<section id='popup-container' className='flex-column small-gap'>
				{messages.map((val) => (
					<PopupMessage key={val.uuid} message={val.message} duration={val.duration} type={val.type} onTimeOut={() => removeMessage(val.uuid)} />
				))}
			</section>
			{props.children}
		</PopupMessageContext.Provider>
	);
}

interface PopupMessageNodeProps {
	message: ReactNode;
	duration: number;
	type: PopupMessageType;
	onTimeOut: () => void;
}

function PopupMessage(props: PopupMessageNodeProps) {
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
		<section className='popup-message' style={{ backgroundColor: color }}>
			{props.message}
			<ClearIconButton icon={QUIT_ICON} title='remove' onClick={() => props.onTimeOut()} />
		</section>
	);
}
