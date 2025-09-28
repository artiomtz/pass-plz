interface User {
    email: string;
    id: number;
    lastVisited: string;
}

export function getUserDisplayName(email: string): string {
    const username = email.split('@')[0];

    return username.charAt(0).toUpperCase() + username.slice(1);
}

export default User;
