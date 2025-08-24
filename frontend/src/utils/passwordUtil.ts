const DISALLOWED_CHARS = /[ \t]/g;

export function sanitizePassword(
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (value: string) => void
) {
    const cleaned = e.target.value.replace(DISALLOWED_CHARS, '');
    setter(cleaned);
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
    const trimmed = password.trim();
    const checks = {
        length: trimmed.length >= 12, /// const
        upper: /[A-Z]/.test(trimmed),
        lower: /[a-z]/.test(trimmed),
        number: /\d/.test(trimmed),
        symbol: /[!@#$%^&*(),.?":{}|<>]/.test(trimmed),
        noSpace: !/[ \t]/.test(trimmed),
    };

    const isValid = Object.values(checks).every(Boolean);
    return { isValid, checks };
}
