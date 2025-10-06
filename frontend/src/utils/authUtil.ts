export const getBasicAuthHeader = (email: string, password: string): string => {
    const base64 = btoa(`${email}:${password}`);

    return `Basic ${base64}`;
};

export const getBearerHeader = (token: string): string => {
    return `Bearer ${token}`;
};
