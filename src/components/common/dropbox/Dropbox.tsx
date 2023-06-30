import './Dropbox.css';
import '../../../styles.css';

import React, { ChangeEventHandler, ReactNode } from 'react';
import DropboxElement from './DropboxElement';

export default class Dropbox extends React.Component<
	{
		placeholder?: string;
		value: string;
		items: any[];
		children?: ReactNode;
		insideChildren?: ReactNode;
		converter: (items: any, index: number) => ReactNode;
		onChoose: (item: any) => void;
		onChange?: ChangeEventHandler<HTMLInputElement>;
	}, //
	{ showDropbox: boolean }
> {
	constructor(props: any) {
		super(props);
		this.state = {
			showDropbox: false
		};
	}

	render() {
		return (
			<section className='dropbox'>
				<section className='dropbox-input small-gap'>
					<input
						className='dropbox-text'
						title='Choose tag'
						type='text'
						value={this.props.value}
						placeholder={this.props.placeholder}
						onChange={(event) => {
							if (this.props.onChange) this.props.onChange(event);
							this.setState({ showDropbox: true });
						}}
						onClick={() => this.setState({ showDropbox: !this.state.showDropbox })}
						onFocus={() => this.setState({ showDropbox: !this.state.showDropbox })}
					/>
					{this.props.insideChildren}
				</section>
				<section className='dropbox-popup'>
					{this.state.showDropbox && (
						<section className='dropbox-element-container'>
							{this.props.items ? (
								this.props.items.map((node, index) => (
									<DropboxElement
										key={index}
										onClick={() => {
											this.setState({ showDropbox: false });
											this.props.onChoose(node);
										}}
										children={this.props.converter(node, index)}
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
}
