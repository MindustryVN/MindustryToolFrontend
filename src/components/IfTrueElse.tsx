import React, { ReactNode } from 'react';

interface IfTrueElseProps {
	condition: any;
	whenTrue: ReactNode;
	whenFalse: ReactNode;
}
export default function IfTrueElse({ condition, whenTrue, whenFalse }: IfTrueElseProps) {
	if (condition) return <>{whenTrue}</>;

	return <>{whenFalse}</>;
}
