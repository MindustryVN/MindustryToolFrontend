import React from 'react';

import { IconType } from 'src/data/Icons';

interface IconProps {
	className?: string;
	icon: IconType;
}

export default function Icon(props: IconProps) {
	return <img className={props.className} src={props.icon} alt='icon' />;
}
