import React, { ChangeEventHandler, ReactNode, useState } from 'react';
import DropboxElement from './DropboxElement';
import { Trans } from 'react-i18next';

interface DropboxProps<ItemType> {
	placeholder?: string;
	value: string;
	items: ItemType[];
	children?: ReactNode;
	insideChildren?: ReactNode;
	mapper: (items: ItemType, index: number) => ReactNode;
	onChoose: (item: ItemType) => void;
	onChange?: ChangeEventHandler<HTMLInputElement>;
}

export default function Dropbox<ItemType>(props: DropboxProps<ItemType>) {
	const [showDropbox, setShowDropbox] = useState(false);

	return (
		<section className='flex flex-col h-10 border-2 border-slate-500 w-full rounded-lg box-border'>
			<section className='flex justify-center ml-2 h-full gap-2 px-1'>
				<input
					className='w-full h-full bg-transparent placeholder:bg-transparent shadow-none focus:border-none focus:outline-none'
					type='text'
					value={props.value}
					title={props.placeholder}
					placeholder={props.placeholder}
					onChange={(event) => {
						if (props.onChange) props.onChange(event);
					}}
					onClick={() => setShowDropbox((prev) => !prev)}
					onFocus={() => () => setShowDropbox((prev) => !prev)}
					onKeyDown={(event) => {
						if (event.key === 'Enter') setShowDropbox((prev) => !prev);
					}}
				/>
				{props.insideChildren}
			</section>
			<section className='relative'>
				{showDropbox && (
					<section className='absolute flex flex-col justify-start items-start w-full z-overlay max-h-[50vh] mt-2 overflow-x-hidden overflow-y-auto border-2 border-slate-500 rounded-lg bg-slate-900'>
						{props.items ? (
							props.items.map((node, index) => (
								<DropboxElement
									key={index}
									onClick={() => {
										setShowDropbox(false);
										props.onChoose(node);
									}}
									children={props.mapper(node, index)}
								/>
							))
						) : (
							<Trans i18next='no-result' />
						)}
					</section>
				)}
			</section>
		</section>
	);
}
