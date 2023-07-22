import './PopupMessageProvider.css';
import 'src/styles.css';

import { v4 } from 'uuid';
import ClearIconButton from 'src/components/button/ClearIconButton';

import React, { ReactNode, useEffect } from 'react';
import { API } from 'src/API';
import i18n from 'src/util/I18N';

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
	addPopup: (message: ReactNode, duration: number, type: PopupMessageType) => void;
}

export const PopupMessageContext = React.createContext<PopupMessageContextProps>({
	addPopup: (message: ReactNode, duration: number, type: PopupMessageType) => {},
});

interface PopupMessageProviderProps {
	children: ReactNode;
}

export default function AlertProvider(props: PopupMessageProviderProps) {
	const [messages, setMessages] = React.useState<PopupMessageData[]>([]);

	useEffect(() => {
		const start = Date.now();

		function addMessage(props: PopupMessageProps) {
			let uuid: string = v4();
			let val: PopupMessageData = {
				message: props.message,
				duration: props.duration,
				uuid: uuid,
				type: props.type,
			};
			setMessages((prev) => [val, ...prev]);
		}

		const id: NodeJS.Timeout = setTimeout(() => {
			addMessage({
				message: i18n.t('high-ping-reason').toString(),
				duration: 10,
				type: 'info',
			});
			return () => clearTimeout(id);
		}, 3000);

		API.REQUEST.get('ping') //
			.then(() => {
				addMessage({
					message: `Ping: ${Date.now() - start}ms`,
					duration: 5,
					type: 'info',
				});
				clearTimeout(id);
			}) //
			.catch(() =>
				addMessage({
					message: 'lost-connection',
					duration: 5,
					type: 'error',
				}),
			);
	}, []);

	function addMessage(message: ReactNode, duration: number, type: PopupMessageType) {
		let uuid: string = v4();
		let val: PopupMessageData = {
			message: message,
			duration: duration,
			uuid: uuid,
			type: type,
		};
		setMessages([val, ...messages]);
	}

	function removeMessage(id: string) {
		setMessages((prev) => [...prev.filter((val) => id !== val.uuid)]);
	}

	return (
		<PopupMessageContext.Provider value={{ addPopup: addMessage }}>
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
	useEffect(() => {
		let id: NodeJS.Timeout = setTimeout(() => {
			props.onTimeOut();
		}, props.duration * 1000);

		return () => clearTimeout(id);
	}, [props]);

	return (
		<section className={'popup-message w100p ' + props.type}>
			<section className='popup-message-content flex-row w100p'>
				{props.message}
				<ClearIconButton className='absolute top right small-margin' icon='/assets/icons/quit.png' title='remove' onClick={() => props.onTimeOut()} />
			</section>
			<div className='timer' style={{ animation: `timer ${props.duration}s linear forwards` }} />
		</section>
	);
}
