import React, { ReactNode, useState } from 'react';
import Model from 'src/components/model/Model';

export default function useModel() {
	const [visibility, setVisibility] = useState(false);

	return {
		model: (children: ReactNode, className?: string) => {
			if (visibility) return <Model className={className ? className : ''}>{children}</Model>;
			else return <></>;
		},

		setVisibility: setVisibility,
	};
}
