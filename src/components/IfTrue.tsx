import React, { ReactNode } from 'react';

interface IfTrueProps {
	condition: any;
	whenTrue: ReactNode;
}

// Just make my code look better, no uses
export default function IfTrue(props: IfTrueProps) {
	if (props.condition) return <>{props.whenTrue}</>;
	return <></>;
}
