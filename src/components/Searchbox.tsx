import React, { ChangeEventHandler, ReactNode, useState } from 'react';
import { Trans } from 'react-i18next';
import DropboxElement from 'src/components/DropboxElement';
import { cn } from 'src/util/Utils';

interface SearchBoxProps<T> {
	className?: string;
	placeholder?: string;
	value: string;
	items: T[];
	children?: ReactNode;
	mapper: (items: T, index: number) => ReactNode;
	onChoose: (item: T) => void;
	onChange?: ChangeEventHandler<HTMLInputElement>;
}

export default function SearchBox<T>({ className, placeholder, value, items, children, mapper, onChoose, onChange }: SearchBoxProps<T>) {
	const [showDropbox, setShowDropbox] = useState(false);

	return (
		<div className={cn('flex flex-col border-2 border-slate-500 w-full rounded-lg box-border', className)}>
			<section className='flex justify-center ml-2 h-full gap-2 px-1'>
				<input
					className='w-full h-full bg-transparent placeholder:bg-transparent shadow-none focus:border-none focus:outline-none'
					type='text'
					value={value}
					title={placeholder}
					placeholder={placeholder}
					onClick={() => setShowDropbox((prev) => !prev)}
					onFocus={() => () => setShowDropbox((prev) => !prev)}
					onChange={(event) => {
						if (onChange) onChange(event);
					}}
					onKeyDown={(event) => {
						if (event.key === 'Enter') setShowDropbox((prev) => !prev);
					}}
				/>
				{children}
			</section>
			<section className='relative'>
				{showDropbox && (
					<section className='absolute flex flex-col justify-start items-start w-full z-overlay max-h-[50vh] mt-2 overflow-x-hidden overflow-y-auto border-2 border-slate-500 rounded-lg bg-slate-900'>
						{items ? (
							items.map((node, index) => (
								<DropboxElement
									key={index}
									onClick={() => {
										setShowDropbox(false);
										onChoose(node);
									}}
									children={mapper(node, index)}
								/>
							))
						) : (
							<Trans i18next='no-result' />
						)}
					</section>
				)}
			</section>
		</div>
	);
}
