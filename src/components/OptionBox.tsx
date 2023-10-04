import React, { ReactNode, useState } from 'react';
import DropboxElement from 'src/components/DropboxElement';
import { ArrowDownIcon, ArrowUpIcon } from 'src/components/Icon';
import OutsideAlerter from 'src/components/OutsideAlerter';
import { cn } from 'src/util/Utils';

interface OptionBoxProps<T> {
	className?: string;
	items: T[];
	defaultValue?: T;
	children?: ReactNode;
	mapper: (items: T, index: number) => ReactNode;
	onChoose: (item: T) => void;
}

export default function OptionBox<T>({ className, defaultValue, items, children, mapper, onChoose }: OptionBoxProps<T>) {
	const [choice, setChoice] = useState(defaultValue ? defaultValue : items[0]);
	const [showDropbox, setShowDropbox] = useState(false);

	return (
		<OutsideAlerter className={cn('flex h-full flex-col justify-center rounded-lg outline outline-2 outline-slate-500', className)} onClickOutside={() => setShowDropbox(false)}>
			<div
				role='button'
				className={'flex h-full flex-col justify-center'}
				onClick={() => setShowDropbox((prev) => !prev)}
				onFocus={() => () => setShowDropbox((prev) => !prev)}
				onKeyDown={(event) => {
					if (event.key === 'Enter') setShowDropbox((prev) => !prev);
				}}>
				<section className='flex h-full w-full flex-row items-center justify-between gap-2 px-1'>
					<div>{mapper(choice, 0)}</div>
					{children}
					{showDropbox ? <ArrowUpIcon className='flex h-4 w-4 items-center justify-center' /> : <ArrowDownIcon className='flex h-4 w-4 items-center justify-center' />}
				</section>
				<div className='relative w-full'>
					{showDropbox && (
						<section className='no-scrollbar absolute left-0 top-1 z-overlay w-full overflow-x-auto rounded-lg border-2 border-slate-500 bg-slate-900'>
							{items
								.filter((item) => item !== choice)
								.map((item, index) => (
									<DropboxElement
										key={index}
										onClick={() => {
											setChoice(item);
											onChoose(item);
											setShowDropbox(true);
										}}>
										{mapper(item, index)}
									</DropboxElement>
								))}
						</section>
					)}
				</div>
			</div>
		</OutsideAlerter>
	);
}
