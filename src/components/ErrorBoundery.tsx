import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Trans } from 'react-i18next';

interface ErrorBoundaryProps {
	children: ReactNode;
}

interface ErrorBoundaryState {
	error: Error | undefined;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	public state: ErrorBoundaryState = {
		error: undefined,
	};

	public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return { error };
	}

	public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error('Uncaught error:', error, errorInfo);
		this.setState({ error });
	}

	public render() {
		if (this.state.error !== undefined) {
			return (
				<span className='flex h-full w-full items-center justify-center'>
					<Trans i18nKey='error' />
					{this.state.error.name}
					<br />
					{this.state.error.message}
				</span>
			);
		}

		return this.props.children;
	}
}
