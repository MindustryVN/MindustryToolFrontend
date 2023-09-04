import React, { ReactNode } from 'react';

interface DropboxElementProps {
	children: ReactNode;
	onClick: () => void;
}

export default function DropboxElement(props: DropboxElementProps) {
	return (
		<button className='flex w-full active:bg-slate-100 hover:bg-slate-100 focus:bg-slate-100 px-2 py-1' title='' type='button' onClick={() => props.onClick()}>
			{props.children}
		</button>
	);
}
