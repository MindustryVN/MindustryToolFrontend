import React, { ReactNode } from 'react';

interface ConditionProps {
	condition: boolean | undefined | null;
	element: ReactNode;
}

// Just make my code look better, no uses
export default function Condition(props: ConditionProps) {
	if (!props.condition) return <></>;

	return <>{props.element}</>;
}
