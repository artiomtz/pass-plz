export interface User {
    id: number;
    email: string;
    lastVisited: string;
}

export function getUserDisplayName(email: string): string {
    const username = email.split('@')[0];
    return username.charAt(0).toUpperCase() + username.slice(1);
}
