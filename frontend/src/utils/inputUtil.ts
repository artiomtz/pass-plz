import PasswordEntry from '@models/passwordEntry';
import { draftStorage, getDraftKey } from '@utils/storageUtil';

const DISALLOWED_CHARS = /[ \t~#$%^&*"'`<>()[\]{}:;,]/g;

export function sanitizeInput(input: string) {
    return input?.trim().replace(DISALLOWED_CHARS, '');
}

export function validateEmail(email: string): boolean {
    const trimmed = email?.trim().toLowerCase();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return regex.test(trimmed);
}

export const normalizeTag = (tag: string): string => {
    if (!tag) {
        return '';
    }

    return tag.trim().replace(/\s+/g, '-').toLowerCase();
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

export function sanitizeFormData<T extends Record<string, any>>(formData: T): T {
    const sanitized: Record<string, any> = {};

    for (const [key, value] of Object.entries(formData)) {
        if (typeof value === 'string') {
            const trimmed = value?.trim();
            sanitized[key] = trimmed === '' ? null : trimmed;
        } else {
            sanitized[key] = value;
        }
    }

    return sanitized as T;
}

export function saveFormDataDraft<T extends { id?: number | null }>(formData: T): void {
    const draftKey = getDraftKey(formData.id);
    const sanitized = sanitizeFormData(formData);
    draftStorage.set(draftKey, sanitized);
}
