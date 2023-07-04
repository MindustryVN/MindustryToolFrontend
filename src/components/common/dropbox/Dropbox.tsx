import './Dropbox.css';
import '../../../styles.css';

import React, { ChangeEventHandler, ReactNode, useState } from 'react';
import DropboxElement from './DropboxElement';

interface DropboxParam<ItemType> {
	placeholder?: string;
	value: string;
	items: ItemType[];
	children?: ReactNode;
	insideChildren?: ReactNode;
	converter: (items: ItemType, index: number) => ReactNode;
	onChoose: (item: ItemType) => void;
	onChange?: ChangeEventHandler<HTMLInputElement>;
}

export default function Dropbox<ItemType>(param: DropboxParam<ItemType>) {
	const [showDropbox, setShowDropbox] = useState(false);

	return (
		<section className='dropbox'>
			<section className='dropbox-input small-gap'>
				<input
					className='dropbox-text'
					title='Choose tag'
					type='text'
					value={param.value}
					placeholder={param.placeholder}
					onChange={(event) => {
						if (param.onChange) param.onChange(event);
						setShowDropbox(true);
					}}
					onClick={() => setShowDropbox((prev) => !prev)}
					onFocus={() => () => setShowDropbox((prev) => !prev)}
				/>
				{param.insideChildren}
			</section>
			<section className='dropbox-popup'>
				{showDropbox && (
					<section className='dropbox-element-container'>
						{param.items ? (
							param.items.map((node, index) => (
								<DropboxElement
									key={index}
									onClick={() => {
										setShowDropbox(false);
										param.onChoose(node);
									}}
									children={param.converter(node, index)}
								/>
							))
						) : (
							<span>No result</span>
						)}
					</section>
				)}
			</section>
		</section>
	);
}
