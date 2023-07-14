import React, { ReactNode, useState } from 'react';
import Model from 'src/components/common/Model';

export default function useModel() {
	const [open, setOpen] = useState(false);

	return {
		model: (children: ReactNode, className?: string) => {
			if (open) return <Model className={className}>{children}</Model>;
			else return <></>;
		},

		setOpenModel: (value: boolean) => setOpen(value),
	};
}
