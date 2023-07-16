import React, { useState } from 'react';
import Dialog from 'src/components/dialog/Dialog';

export default function useDialog() {
	const [openDialog, setOpenDialog] = useState(false);

	return {
		setOpenDialog: (state: boolean) => setOpenDialog(state),
		dialog: (children: React.ReactNode, className?: string) => {
			if (openDialog) return <Dialog className={className} onClose={() => setOpenDialog(false)} children={children} />;
			return <></>;
		},
	};
}
