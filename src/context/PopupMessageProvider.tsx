import './PopupMessageProvider.css';
import 'src/styles.css';

import { v4 } from 'uuid';
import ClearIconButton from 'src/components/button/ClearIconButton';

import React, { ReactNode, useEffect, useRef } from 'react';
import { API } from 'src/API';
import i18n from 'src/util/I18N';

type PopupMessageType = 'info' | 'warning' | 'error';

interface PopupMessageData {
	content: ReactNode;
	duration: number;
	type: PopupMessageType;
	uuid: string;
}

interface PopupMessageProps {
	content: ReactNode;
	duration: number;
	type: PopupMessageType;
}

interface PopupMessageContextProps {
	addPopup: (content: ReactNode, duration: number, type: PopupMessageType) => void;
}

export const PopupMessageContext = React.createContext<PopupMessageContextProps>({
	addPopup: (_: ReactNode, __: number, ___: PopupMessageType) => {},
});

interface PopupMessageProviderProps {
	children: ReactNode;
}

export default function AlertProvider(props: PopupMessageProviderProps) {
	const [contents, setMessages] = React.useState<PopupMessageData[]>([]);

	useEffect(() => {
		const start = Date.now();

		function addMessage(props: PopupMessageProps) {
			let uuid: string = v4();
			let val: PopupMessageData = {
				content: props.content,
				duration: props.duration,
				uuid: uuid,
				type: props.type,
			};
			setMessages((prev) => [val, ...prev]);
		}

		const id: NodeJS.Timeout = setTimeout(() => {
			addMessage({
				content: i18n.t('high-ping-reason').toString(),
				duration: 10,
				type: 'info',
			});
			return () => clearTimeout(id);
		}, 4000);

		API.getPing() //
			.then(() => {
				addMessage({
					content: `Ping: ${Date.now() - start}ms`,
					duration: 5,
					type: 'info',
				});
				clearTimeout(id);
			}) //
			.catch(() =>
				addMessage({
					content: 'lost-connection',
					duration: 5,
					type: 'error',
				}),
			);
	}, []);

	function addMessage(content: ReactNode, duration: number, type: PopupMessageType) {
		let uuid: string = v4();
		let val: PopupMessageData = {
			content: content,
			duration: duration,
			uuid: uuid,
			type: type,
		};

		setMessages((prev) => [val, ...prev]);
	}

	function removeMessage(id: string) {
		setMessages((prev) => [...prev.filter((val) => id !== val.uuid)]);
	}

	return (
		<PopupMessageContext.Provider value={{ addPopup: addMessage }}>
			<section id='popup-container' className='flex-column small-gap'>
				{contents.map((val) => (
					<PopupMessage //
						key={val.uuid}
						content={val.content}
						duration={val.duration}
						type={val.type}
						onTimeOut={() => removeMessage(val.uuid)}
					/>
				))}
			</section>
			{props.children}
		</PopupMessageContext.Provider>
	);
}

interface PopupMessageNodeProps {
	content: ReactNode;
	duration: number;
	type: PopupMessageType;
	onTimeOut: () => void;
}

function PopupMessage(props: PopupMessageNodeProps) {
	const ref = useRef(props);

	useEffect(() => {
		let id: NodeJS.Timeout = setTimeout(() => {
			ref.current.onTimeOut();
		}, ref.current.duration * 1000);

		return () => clearTimeout(id);
	}, []);

	return (
		<section className={'popup-content w100p ' + props.type}>
			<section className='popup-content-content flex-row w100p'>
				{props.content}
				<ClearIconButton //
					className='absolute top right small-margin'
					icon='/assets/icons/quit.png'
					title='remove'
					onClick={() => props.onTimeOut()}
				/>
			</section>
			<div className='timer' style={{ animation: `timer ${props.duration}s linear forwards` }} />
		</section>
	);
}
