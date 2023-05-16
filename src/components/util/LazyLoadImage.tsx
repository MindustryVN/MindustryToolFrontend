import React from 'react';
import Api from '../../AxiosConfig';

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
            Api.get(this.props.path) //
                .then((result) => {
                    let data = 'data:image/png;base64,' + result.data;
                    this.setState(() => ({ src: data }));
                    LazyLoadImage.imageMap[this.props.path] = data;
                })
                .catch(() => this.setState(() => ({ error: true })));
    }

    render() {
        return <img className={this.props.className} src={this.state.src} alt={this.state.error ? 'Error' : 'Loading'} />;
    }
}
