export type ApiResponse<T> = { ok: true; data: T } | { ok: false; error: string };

// export type ApiError =
//     | { type: 'auth'; message: string }
//     | { type: 'server'; message: string }
//     | { type: 'network'; message: string }
//     | { type: 'validation'; message: string }
//     | { type: 'unknown'; message: string };

export const handleApiError = (error: any): ApiResponse<never> => {
    if (!error?.response) {
        return { ok: false, error: 'Failed to connect to server' };
    }

    if (!error.response.data) {
        return { ok: false, error: 'Server error occurred' };
    }

    if (error.response.data.message) {
        return { ok: false, error: error.response.data.message };
    }

    return { ok: false, error: 'Unexpected error occurred' };
};

// export const handleApiError = (error: any): ApiError => {
//     if (!error?.response) {
//         return { type: 'network', message: 'Failed to connect to server' };
//     }

//     if (!error.response.data) {
//         return { type: 'server', message: 'Server error occurred' };
//     }

//     if (error.response.data.message) {
//         if (error.response.status === 401 || error.response.status === 403) {
//             return { type: 'auth', message: error.response.data.message };
//         } else if (error.response.status === 406) {
//             return { type: 'validation', message: error.response.data.message };
//         }

//         return { type: 'server', message: error.response.data.message };
//     }

//     return { type: 'unknown', message: 'Unexpected error occurred' };
// };
