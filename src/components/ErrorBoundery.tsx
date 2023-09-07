import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Trans } from 'react-i18next';

interface ErrorBoundaryProps {
	children: ReactNode;
}

interface ErrorBoundaryState {
	hasError: boolean;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	public state: ErrorBoundaryState = {
		hasError: false,
	};

	public static getDerivedStateFromError(_: Error): ErrorBoundaryState {
		return { hasError: true };
	}

	public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error('Uncaught error:', error, errorInfo);
	}

	public render() {
		if (this.state.hasError) {
			return (
				<h1>
					<Trans i18nKey='error' />
				</h1>
			);
		}

		return this.props.children;
	}
}
