import React from 'react';
import { API } from '../../AxiosConfig';
import { PNG_IMAGE_PREFIX } from '../../Config';

export interface IHash {
	[details: string]: string;
}

export default class LazyLoadImage extends React.Component<{ className: string; path: string }, { src: string; error: boolean }> {
	static imageMap: IHash = {};

	state = { src: '', error: false };
	componentDidMount() {
		let data = LazyLoadImage.imageMap[this.props.path];
		if (data) this.setState({ src: data });
		else
			API.get(this.props.path) //
				.then((result) => {
					let data = PNG_IMAGE_PREFIX + result.data;
					this.setState(() => ({ src: data }));
					LazyLoadImage.imageMap[this.props.path] = data;
				})
				.catch(() => this.setState(() => ({ error: true })));
	}

	render() {
		return <img className={this.props.className} src={this.state.src} alt={this.state.error ? 'Error' : 'Loading'} />;
	}
}
