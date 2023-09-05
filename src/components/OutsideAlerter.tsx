import React, { useEffect, useRef } from 'react';
import { ReactNode } from 'react-markdown/lib/ast-to-react';
import { cn } from 'src/util/Utils';

interface OutsideAlerterProps {
	className?: string;
	children: ReactNode;
	onClickOutside: () => void;
}

export default function OutsideAlerter({ className, children, onClickOutside }: OutsideAlerterProps) {
	const wrapperRef = useRef(null);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			// @ts-ignore
			if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
				onClickOutside();
			}
		}
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [wrapperRef, onClickOutside]);

	return (
		<div ref={wrapperRef} className={cn(className)}>
			{children}
		</div>
	);
}
