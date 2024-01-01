import React, { ChangeEventHandler, ReactNode, useState } from 'react';
import { Trans } from 'react-i18next';
import DropboxElement from 'src/components/DropboxElement';
import OutsideAlerter from 'src/components/OutsideAlerter';
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
		<OutsideAlerter className={cn('flex h-full flex-col justify-center rounded-lg bg-transparent outline outline-2 outline-slate-500', className)} onClickOutside={() => setShowDropbox(false)}>
			<div
				className={cn('flex h-full flex-col justify-center', className)}
				role='button'
				onClick={() => setShowDropbox((prev) => !prev)}
				onFocus={() => () => setShowDropbox((prev) => !prev)}
				onKeyDown={(event) => {
					if (event.key === 'Enter') setShowDropbox((prev) => !prev);
				}}>
				<section className='flex h-full w-full flex-row items-center justify-center gap-2 px-1'>
					<input
						className='h-full w-full bg-transparent shadow-none placeholder:bg-transparent focus:border-none focus:outline-none'
						type='text'
						value={value}
						placeholder={placeholder}
						onChange={(event) => {
							if (onChange) onChange(event);
						}}
					/>
					{children}
				</section>
				<section className='relative w-full'>
					{showDropbox && (
						<section className='absolute z-overlay mb-4 mt-2 flex max-h-[50vh] w-full flex-col items-start justify-start overflow-y-auto overflow-x-hidden rounded-lg border border-slate-500 bg-slate-950'>
							{items.length !== 0 ? (
								items.map((node, index) => (
									<DropboxElement
										key={index}
										onClick={() => {
											setShowDropbox(true);
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
		</OutsideAlerter>
	);
}
