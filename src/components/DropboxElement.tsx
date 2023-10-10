import React, { ReactNode } from 'react';

interface DropboxElementProps {
	children: ReactNode;
	onClick: () => void;
}

export default function DropboxElement({ children, onClick }: DropboxElementProps) {
	return (
		<button className='flex w-full px-2 py-1 hover:bg-slate-700 focus:bg-slate-700 active:bg-slate-700' title='' type='button' onClick={() => onClick()}>
			{children}
		</button>
	);
}
