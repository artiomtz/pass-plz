const DISALLOWED_CHARS = /[ \t]/g;
export const MIN_PASSWORD_LENGTH = import.meta.env.USER_PASSWORD_MIN_LENGTH ?? 12;

export function sanitizeBadCharacters(input: string) {
    return input?.trim().replace(DISALLOWED_CHARS, '');
}

export function validatePassword(password: string): {
    isValid: boolean;
    checks: {
        length: boolean;
        upper: boolean;
        lower: boolean;
        number: boolean;
        symbol: boolean;
        noSpace: boolean;
    };
} {
    const trimmed = password?.trim();
    const checks = {
        length: trimmed.length >= MIN_PASSWORD_LENGTH,
        lower: /[a-z]/.test(trimmed),
        noSpace: !/[ \t]/.test(trimmed),
        number: /\d/.test(trimmed),
        symbol: /[!@#$%^&*(),.?":{}|<>]/.test(trimmed),
        upper: /[A-Z]/.test(trimmed),
    };

    const isValid = Object.values(checks).every(Boolean);

    return { checks, isValid };
}
