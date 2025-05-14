export interface PasswordEntry {
    id: number;
    userId: number;
    name: string;
    username: string;
    password: string;
    createdDate: string; // ISO 8601
    updatedDate: string;
    expirationDate: string | null;
    category: string | null;
    link: string | null;
    note: string | null;
    tags: string[] | null; // comes from a Set<String> on the backend
}
