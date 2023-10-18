import React, { ReactNode, useState } from 'react';
import Model from 'src/components/Model';
import { cn } from 'src/util/Utils';

export default function useModel() {
	const [visibility, setVisibility] = useState(false);

	return {
		model: (children: ReactNode, className?: string) => {
			if (visibility) return <Model className={cn(className)}>{children}</Model>;
			else return <></>;
		},

		setVisibility: setVisibility,
	};
}
