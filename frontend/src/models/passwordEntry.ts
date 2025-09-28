interface PasswordEntry {
    category: string | null;
    createdDate: string;
    expirationDate: string | null;
    id: number;
    link: string | null;
    name: string;
    note: string | null;
    password: string;
    tags: string[] | null;
    updatedDate: string;
    userId: number;
    username: string;
}

export default PasswordEntry;
