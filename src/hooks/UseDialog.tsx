import React, { useState } from 'react';
import Dialog from 'src/components/dialog/Dialog';

export default function useDialog() {
	const [visibility, setVisibility] = useState(false);

	return {
		setVisibility: setVisibility,
		dialog: (children: React.ReactNode, className?: string) => {
			if (visibility) return <Dialog className={className} children={children} />;
			return <></>;
		},
	};
}
