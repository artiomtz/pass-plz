export const getBasicAuthHeader = (email: string, password: string) => {
    const base64 = btoa(`${email}:${password}`);

    return `Basic ${base64}`;
};

export const getBearerHeader = (token: string) => {
    return `Bearer ${token}`;
};
