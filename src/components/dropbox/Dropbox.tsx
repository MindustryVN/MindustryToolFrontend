import './Dropbox.css';
import '../../styles.css';

import React, { ChangeEventHandler, ReactNode, useState } from 'react';
import DropboxElement from './DropboxElement';

interface DropboxProps<ItemType> {
	placeholder?: string;
	value: string;
	items: ItemType[];
	children?: ReactNode;
	insideChildren?: ReactNode;
	converter: (items: ItemType, index: number) => ReactNode;
	onChoose: (item: ItemType) => void;
	onChange?: ChangeEventHandler<HTMLInputElement>;
}

export default function Dropbox<ItemType>(props: DropboxProps<ItemType>) {
	const [showDropbox, setShowDropbox] = useState(false);

	return (
		<section className="dropbox">
			<section className="dropbox-input small-gap">
				<input
					className="dropbox-text"
					type="text"
					value={props.value}
					title={props.placeholder}
					placeholder={props.placeholder}
					onChange={(event) => {
						if (props.onChange) props.onChange(event);
						setShowDropbox(true);
					}}
					onClick={() => setShowDropbox((prev) => !prev)}
					onFocus={() => () => setShowDropbox((prev) => !prev)}
				/>
				{props.insideChildren}
			</section>
			<section className="dropbox-popup">
				{showDropbox && (
					<section className="dropbox-element-container">
						{props.items ? (
							props.items.map((node, index) => (
								<DropboxElement
									key={index}
									onClick={() => {
										setShowDropbox(false);
										props.onChoose(node);
									}}
									children={props.converter(node, index)}
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
