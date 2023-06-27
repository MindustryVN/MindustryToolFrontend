import React from 'react';
import { API } from '../../API';
import { PNG_IMAGE_PREFIX } from '../../config/Config';
import { IHash } from './IHash';

export default class LazyLoadImage extends React.Component<{ className: string; path: string }, { src: string; error: boolean }> {
	static imageMap: IHash = {};

	state = { src: '', error: false };
	componentDidMount() {
		const data = LazyLoadImage.imageMap[this.props.path];
		if (data) this.setState({ src: data });
		else
			API.REQUEST.get(this.props.path) //
				.then((result) => {
					const data = PNG_IMAGE_PREFIX + result.data;
					this.setState(() => ({ src: data }));
					LazyLoadImage.imageMap[this.props.path] = data;
				})
				.catch((error) => this.setState(() => ({ error: true })));
	}

	render() {
		return <img className={this.props.className} src={this.state.src} alt={this.state.error ? 'Image not found' : 'Loading'} loading='lazy' />;
	}
}
