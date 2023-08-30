import React, { ReactNode } from 'react';

interface MessageScreenProps {
	children: ReactNode;
}

export default function MessageScreen({ children }: MessageScreenProps) {
	return <div className='flex items-center justify-center w-full h-full'>{children}</div>;
}
