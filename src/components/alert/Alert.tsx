import './Alert.css';

import React, { ReactNode, useEffect } from 'react';

interface AlertProps {
	caller: (message: ReactNode, timeOut : number) => void;
}

export default function Alert(props: AlertProps) {


	return <div className='alert'>Alert</div>;
}

interface AlertMessageProps {
	message: ReactNode;
	timeOut: number;
}

export function AlertMessage(props : AlertMessageProps) {
    return <div>{props.message}</div>;
}
