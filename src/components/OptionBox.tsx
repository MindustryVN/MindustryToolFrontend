import React, { ReactNode, useState } from 'react';
import DropboxElement from 'src/components/DropboxElement';
import { ArrowDown, ArrowUp } from 'src/components/Icon';
import { cn } from 'src/util/Utils';

interface OptionBoxProps<T> {
	className?: string;
	items: T[];
	mapper: (items: T, index: number) => ReactNode;
	onChoose: (item: T) => void;
}

export default function OptionBox<T>({ className, items, mapper, onChoose }: OptionBoxProps<T>) {
	const [choice, setChoice] = useState(items[0]);
	const [showDropbox, setShowDropbox] = useState(false);

	return (
		<div className={cn('border-2 border-slate-500 rounded-lg', className)}>
			<button
				className='w-full h-full bg-transparent flex flex-row justify-between items-center gap-2 p-2'
				type='button'
				onClick={() => setShowDropbox((prev) => !prev)}
				onFocus={() => () => setShowDropbox((prev) => !prev)}
				onKeyDown={(event) => {
					if (event.key === 'Enter') setShowDropbox((prev) => !prev);
				}}>
				{mapper(choice, 0)}
				{showDropbox ? <ArrowUp className='w-4 h-4 flex items-center justify-center' /> : <ArrowDown className='w-4 h-4 flex items-center justify-center' />}
			</button>
			<div className='relative'>
				{showDropbox && (
					<section className='absolute w-full top-1 left-0 border-2 border-slate-500 rounded-lg overflow-auto bg-slate-900 no-scrollbar'>
						{items.map((item, index) => (
							<DropboxElement
								key={index}
								onClick={() => {
									setChoice(item);
									onChoose(item);
									setShowDropbox(false);
								}}>
								{mapper(item, index)}
							</DropboxElement>
						))}
					</section>
				)}
			</div>
		</div>
	);
}
