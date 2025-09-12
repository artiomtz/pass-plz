import React from 'react';
import toast from 'react-hot-toast';

type Props = {
    fallback: React.ReactNode;
    children: React.ReactNode;
};

type State = {
    hasError: boolean;
};

export class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    // static getDerivedStateFromError(error: Error): State {
    //     console.error('Auth error:', error);
    //     //   toast.error("Authentication error. Please sign in again.");
    //     return { hasError: true };
    // }

    static getDerivedStateFromError(_: Error): State {
        console.error(' error...');
        toast.error('Something went wrong');
        // logout
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback;
        }
        return this.props.children;
    }
}
