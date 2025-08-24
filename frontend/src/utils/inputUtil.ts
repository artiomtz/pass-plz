import { PasswordEntry } from '@models/passwordEntry';

const DISALLOWED_CHARS = /[ \t~#$%^&*"'`<>()[\]{}:;,]/g;

// export function sanitizeInput(value: string): string {
//     return value.replace(DISALLOWED_CHARS, '');
// }

export function sanitizeInput(
    // export function handleSanitizedInput(
    // e: React.ChangeEvent<HTMLInputElement>,
    input: string
    // setter: (value: string) => void
) {
    return input.replace(DISALLOWED_CHARS, '');
    // const cleaned = input.replace(DISALLOWED_CHARS, '');
    // setter(cleaned);
    // const cleaned = e.target.value.replace(DISALLOWED_CHARS, '');
    // const cleaned = sanitizeInput(e.target.value);
}

export function validateEmail(email: string): boolean {
    const trimmed = email.trim().toLowerCase();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(trimmed);
}

export const normalizeTag = (tag: string): string => {
    if (!tag) return '';
    return tag.trim().replace(/\s+/g, '-').toLowerCase();
};

export const enforceCharLimit = (value: string, max: number) =>
    value.length > max ? value.slice(0, max) : value;

// export const hasDisallowedChars = (value: string, regex: RegExp) => {
//         regex.test(value);
// };

export const isExpired = (isoDate: string | null) => {
    if (!isoDate) return false;
    return new Date(isoDate) < new Date();
};

export const getUniqueName = (name: string, entries: PasswordEntry[]): string => {
    let candidate = name;
    let counter = 1;
    const names = new Set(entries.map((e) => e.name));

    while (names.has(candidate)) {
        candidate = `${name} (${counter})`;
        counter++;
    }
    return candidate;
};
