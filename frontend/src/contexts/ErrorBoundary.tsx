import logger from '@utils/loggerUtil';
import { error } from 'console';
import React from 'react';
import toast from 'react-hot-toast';

type Props = {
    fallback: React.ReactNode;
    children: React.ReactNode;
};

type State = {
    hasError: boolean;
};

class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(_: Error): State {
        logger.error('something went wrong', error);
        toast.error('Something went wrong');

        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
