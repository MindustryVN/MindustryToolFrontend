import React, { ReactNode } from 'react';

interface DropboxElementProps {
	children: ReactNode;
	onClick: () => void;
}

export default function DropboxElement({ children, onClick }: DropboxElementProps) {
	return (
		<button className='flex w-full active:bg-slate-600 hover:bg-slate-600 focus:bg-slate-600 px-2 py-1' title='' type='button' onClick={() => onClick()}>
			{children}
		</button>
	);
}
