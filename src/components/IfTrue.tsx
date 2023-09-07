import React, { ReactNode } from 'react';

interface IfTrueProps {
	condition: any;
	whenTrue: ReactNode;
}

// Just make my code look better, no uses
export default function IfTrue({ condition, whenTrue }: IfTrueProps) {
	if (condition) return <>{whenTrue}</>;
	return <></>;
}
