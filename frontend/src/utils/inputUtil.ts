import PasswordEntry from '@models/passwordEntry';
import { draftStorage, getDraftKey } from '@utils/storageUtil';

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
    return input?.trim().replace(DISALLOWED_CHARS, '');
    // const cleaned = input.replace(DISALLOWED_CHARS, '');
    // setter(cleaned);
    // const cleaned = e.target.value.replace(DISALLOWED_CHARS, '');
    // const cleaned = sanitizeInput(e.target.value);
}

export function validateEmail(email: string): boolean {
    const trimmed = email?.trim().toLowerCase();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(trimmed);
}

export const normalizeTag = (tag: string): string => {
    if (!tag) return '';
    return tag.trim().replace(/\s+/g, '-').toLowerCase();
};

// export const enforceCharLimit = (value: string, max: number) =>
//     value.length > max ? value.slice(0, max) : value;

// export const hasDisallowedChars = (value: string, regex: RegExp) => {
//         regex.test(value);
// };

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

// const handleChange = <K extends keyof PasswordEntry>(field: K, value: PasswordEntry[K]) => {
//     let newValue: typeof value = value;

//     if (typeof value === 'string') {
//         const trimmed = value?.trim();
//         newValue = (trimmed === '' ? null : trimmed) as typeof value;
//     }

//     const updated = {
//         ...formData,
//         [field]: newValue,
//     };

//     setFormData(updated);

//     // Save to draft storage
//     const key =
//         formData.id == 0
//             ? (`pass_plz_draft_new` as const)
//             : (`pass_plz_draft_${formData.id}` as const);

//     draftStorage.set(key, updated);
// };

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
    // formData.id && formData.id > 0
    //     ? (`pass_plz_draft_${formData.id}` as const)
    //     : ('pass_plz_draft_new' as const);

    const sanitized = sanitizeFormData(formData);
    draftStorage.set(draftKey, sanitized);
    // draftStorage.set(key, formData); // no
}

// const trimFormData = <T extends Record<string, unknown>>(data: T): T => {
//   const trimmed: Partial<T> = {};

//   for (const key in data) {
//     const value = data[key] as unknown;

//     if (typeof value === 'string') {
//       trimmed[key] = value?.trim() as T[typeof key];
//     } else if (Array.isArray(value)) {
//       trimmed[key] = value.map(v => typeof v === 'string' ? v?.trim() : v) as T[typeof key];
//     } else {
//       trimmed[key] = value as T[typeof key];
//     }
//   }

//   return trimmed as T;
// };
