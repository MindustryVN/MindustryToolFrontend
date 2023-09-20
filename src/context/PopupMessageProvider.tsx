import { v4 } from 'uuid';
import ClearIconButton from 'src/components/ClearIconButton';

import React, { ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { API } from 'src/API';
import i18n from 'src/util/I18N';
import Loading from 'src/components/Loading';
import MessageScreen from 'src/components/MessageScreen';

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

export function usePopup() {
	return useContext(PopupMessageContext);
}

interface PopupMessageContextProps {
	addPopup: (content: ReactNode, duration: number, type: PopupMessageType) => void;
}

export const PopupMessageContext = React.createContext<PopupMessageContextProps>({
	addPopup: (_: ReactNode, __: number, ___: PopupMessageType) => {},
});

interface PopupMessageProvider {
	children: ReactNode;
}

export default function AlertProvider({ children }: PopupMessageProvider) {
	const [contents, setMessages] = useState<PopupMessageData[]>([]);
	const [isLoading, setLoading] = useState(true);
	const [isError, setError] = useState(false);

	useEffect(() => {
		const start = Date.now();

		function addMessage({ content, duration, type }: PopupMessageProps) {
			let uuid: string = v4();
			let val: PopupMessageData = {
				content: content,
				duration: duration,
				uuid: uuid,
				type: type,
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
		}, 8000);

		setLoading(true);

		

		API.getPing() //
			.then(() => {
				addMessage({
					content: `Ping: ${Date.now() - start}ms`,
					duration: 5,
					type: 'info',
				});
			}) //
			.catch(() => {
				setError(true);
				addMessage({
					content: i18n.t('lost-connection'),
					duration: 5,
					type: 'error',
				});
			})
			.finally(() => setLoading(false))
			.then(() => clearTimeout(id));
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
			<section className='pointer-events-none absolute right-0 top-12 z-popup flex h-[calc(100vh-3rem)] w-screen flex-col items-end gap-1 overflow-hidden'>
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
			{isLoading ? (
				<Loading />
			) : isError ? (
				<MessageScreen>
					<div className='flex flex-col gap-2'>
						<h1>Something is wrong, please refresh the page or contact with admin</h1>{' '}
						<a
							className='flex flex-row items-center justify-center gap-x-4 rounded-md bg-blue-800 px-16 py-1' //
							href='https://discord.gg/DCX5yrRUyp'>
							<span>Discord Server</span>
							<img
								className='icon'
								src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAC10lEQVR4AcVXxZLbQBDV2Sd/hUtn/4yX0RBmuIWPiW5hZmZmZjjtKcy4ZCZJnX7KaGFKI3PlVXV5PE1vuKVVi7ZYMhiJJrsiseSOtmjyBbeHuc+MsKDN8oplB/+HTVBrDpA4pXOiXZw0x22qUmC7C751J+ZRBDipwb8lBK1PHF+DJVDrqENt0dQQgjRDeBBDLKHqkkdT4Tasr3BuIgnEDFceeazJySUSyploizprrp725i5HwIuAIRu3kIQhn3G9rcrd3jcnRQPz5H70sW5ulQSiyRKT0KeOfpefQ2JRmg6eKNCb9yZZlk1PX5Vo7YYsGZtzjqD9jPuggw1s4VNhFnZpALMJ+l0y0QUpGk9ZVCvGkxZ8/WYhh9wg0OXH9NrtItUJ+FZaii4Q2KEymLM8TeWyTXUCvojhR2AHCLxSGZy9XKAGgRh+++AFCCgvnuERi2T8+mNRNmeTjGzWdnQy/nAMnxkYBgHTS7lkZYZknLlU+Hfk5qfo63eTXKA9yH3QwUYGYikImFqbgsCm3TmSMXvZ5HoeOzOZCG23HzYyNu3KeRJAbuUSnLxQIBnr+Ly7+nuPS+QCbbcfd4KMk+cLvkvwwkt51eP4jYxatOdwni7dKJJt2+QC7cvcBx1sZCCWgsAr5TG8fqdITQJiKY+h8iI6JS1BvmDT3UclyudtUgE62MB2CrCcqmPYpbyKOxMpOnyqMC3Ypy8mLV2VoTXrs850n75YgDjttdy3jHWfv5rTCB06WaCOhGfyHArdio9RYnEaR8u52z98MkUwb4Huw2eTxtgWxOK+D5J4jAQBHU8kFH7BxVn3FdjAtnKxmtT/W0HSJhck4lkOsLS+JEMOr5JMkAihcGwZgaiiKJWWItyKylh8yqnLcnkmmrkciMWiHLmyTGcng39LDSQuic+7gFYfRMUcre3jFLbCR9eaBXFjduH+5t9XLMNOLcGCNssLoetiqfrz/C+xqsDlSf0bLQAAAABJRU5ErkJggg=='
								alt='Discord'></img>
						</a>
					</div>
				</MessageScreen>
			) : (
				children
			)}
		</PopupMessageContext.Provider>
	);
}

interface PopupMessageNode {
	content: ReactNode;
	duration: number;
	type: PopupMessageType;
	onTimeOut: () => void;
}

function PopupMessage({ content, duration, type, onTimeOut }: PopupMessageNode) {
	const ref = useRef({ duration, onTimeOut });

	useEffect(() => {
		let id: NodeJS.Timeout = setTimeout(() => {
			ref.current.onTimeOut();

			return () => clearTimeout(id);
		}, ref.current.duration * 1000);

		return () => clearTimeout(id);
	}, []);

	return (
		<section className={'pointer-events-auto min-w-[50%] max-w-full animate-slide-in overflow-hidden rounded-l-lg text-white md:min-w-[25%] md:max-w-[50%] ' + type}>
			<section className='flex w-full flex-row items-start justify-between gap-1 p-2'>
				<section className='p-2'>{content}</section>
				<ClearIconButton //
					className='aspect-square h-4 w-4 self-start align-top'
					icon='/assets/icons/quit.png'
					title='remove'
					onClick={() => onTimeOut()}
				/>
			</section>
			<div className='h-1 w-full origin-top-left bg-blue-500' style={{ animation: `timer ${duration}s linear forwards` }} />
		</section>
	);
}
