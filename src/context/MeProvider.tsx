import React, { ReactNode, useContext, useEffect, useState } from 'react';
import User from 'src/data/User';
import { ACCESS_TOKEN } from 'src/config/Config';
import { API } from 'src/API';
import Loading from 'src/components/Loading';
import MessageScreen from 'src/components/MessageScreen';
import i18n from 'src/util/I18N';
import { usePopup } from 'src/context/PopupMessageProvider';

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
	const [isLoading, setLoading] = useState<boolean>(true);
	const [isError, setError] = useState(false);

	const { addPopup } = usePopup();

	useEffect(() => {
		let accessToken = localStorage.getItem(ACCESS_TOKEN);
		const start = Date.now();

		if (accessToken) {
			setLoading(true);
			API.setBearerToken(accessToken);
			API.getMe() //
				.then((result) => {
					let user: User = result.data;
					setMe(user);
					console.log('Logged as ' + user.name);
				})
				.catch((error) => console.log(error))
				.finally(() => setLoading(false));

			API.getPing() //
				.then(() => console.log(`Ping: ${Date.now() - start}ms`)) //
				.catch(() => {
					setError(true);
					addPopup(i18n.t('lost-connection'), 5, 'error');
				})
				.finally(() => setLoading(false))
				.then(() => clearTimeout(id));

			const id: NodeJS.Timeout = setTimeout(() => {
				addPopup(i18n.t('high-ping-reason').toString(), 10, 'info');

				return () => clearTimeout(id);
			}, 8000);
		}
	}, [addPopup]);

	function handleLogOut() {
		setMe(undefined);
		localStorage.removeItem(ACCESS_TOKEN);
	}

	return (
		<MeContext.Provider value={{ me: me, loading: isLoading, handleLogout: handleLogOut }}>
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
		</MeContext.Provider>
	);
}
