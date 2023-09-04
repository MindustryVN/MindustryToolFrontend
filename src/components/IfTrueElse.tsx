import React, { ReactNode } from 'react';

interface IfTrueElseProps {
	condition: any;
	whenTrue: ReactNode;
	whenFalse: ReactNode;
}
export default function IfTrueElse(props: IfTrueElseProps) {
	if (props.condition) return <>{props.whenTrue}</>;

	return <>{props.whenFalse}</>;
}
