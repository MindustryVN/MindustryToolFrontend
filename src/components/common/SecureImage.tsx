import React, { useEffect, useState } from 'react';

import { API } from 'src/API';

interface SecureImageProps {
	url: string;
	className?: string;
	alt?: string;
}

export default function SecureImage(props: SecureImageProps) {
	const [data, setData] = useState<Blob>();
	const [isLoading, setLoading] = useState(true);
	const [isError, setError] = useState(false);

	useEffect(() => {
		setLoading(true);
		setError(false);

		API.get(props.url, { responseType: 'blob' })
			.then((result) => setData(result.data))
			.catch((error) => {
				console.log(error);
				setError(true);
			})
			.finally(() => setLoading(false));
	}, [props.url]);

	if (!data || isLoading || isError) return <div className={props.className ? props.className : ''} title={props.alt ? props.alt : 'Loading'} />;

	return <img className={props.className ? props.className : ''} src={URL.createObjectURL(data)} alt={props.alt ? props.alt : 'Loading'} />;
}
