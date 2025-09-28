export type ApiResponse<T> = { ok: true; data: T } | { ok: false; error: string };

export const handleApiError = (error: any): ApiResponse<never> => {
    if (!error?.response) {
        return { error: 'Failed to connect to server', ok: false };
    }

    if (!error.response.data) {
        return { error: 'Server error occurred', ok: false };
    }

    if (error.response.data.message) {
        return { error: error.response.data.message, ok: false };
    }

    return { error: 'Unexpected error occurred', ok: false };
};
