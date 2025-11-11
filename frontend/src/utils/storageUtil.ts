import User from '@models/user';

const THEME = 'pass_plz_theme';
const USER_KEY = 'pass_plz_user';
const ACCESS_TOKEN_KEY = 'pass_plz_access_token';
const REFRESH_TOKEN_KEY = 'pass_plz_refresh_token';
const RESET_TOKEN_KEY = 'pass_plz_reset_token';

export const DRAFT_PREFIX = 'pass_plz_draft_';
export const DRAFT_PREFIX_NEW = `${DRAFT_PREFIX}new`;
type DraftKey = `${typeof DRAFT_PREFIX_NEW}` | `${typeof DRAFT_PREFIX}${number}`;

export const getTheme = (): string | null => localStorage.getItem(THEME);

export const setTheme = (theme: string): void => {
    localStorage.setItem(THEME, theme);
};

export const clearTheme = (): void => {
    localStorage.removeItem(THEME);
};

export const getAccessToken = (): string | null => localStorage.getItem(ACCESS_TOKEN_KEY);

export const setAccessToken = (token: string): void => {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

export const getRefreshToken = (): string | null => localStorage.getItem(REFRESH_TOKEN_KEY);

export const setRefreshToken = (token: string): void => {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
};

export const getResetToken = (): string | null => localStorage.getItem(RESET_TOKEN_KEY);

export const setResetToken = (token: string): void => {
    localStorage.setItem(RESET_TOKEN_KEY, token);
};

export const clearTokens = (): void => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(RESET_TOKEN_KEY);
};

export const getStoredUser = (): User | null => {
    const stored = localStorage.getItem(USER_KEY);

    return stored ? (JSON.parse(stored) as User) : null;
};

export const setStoredUser = (user: User): void => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearStoredUser = (): void => {
    localStorage.removeItem(USER_KEY);
};

export function getDraftKey(id?: number | null): DraftKey {
    return id && id > 0 ? `${DRAFT_PREFIX}${id}` : `${DRAFT_PREFIX_NEW}`;
}

export function hasDraft(id?: number | null): boolean {
    return !!draftStorage.get(getDraftKey(id));
}

export const draftStorage = {
    clear: (id: number): void => {
        const key = getDraftKey(id);
        localStorage.removeItem(key);
    },

    clearAll: (): void => {
        Object.keys(localStorage)
            .filter((k) => k.startsWith(DRAFT_PREFIX))
            .forEach((k) => localStorage.removeItem(k));
    },

    get: (key: DraftKey): string | null => {
        const raw = localStorage.getItem(key);

        return raw ? JSON.parse(raw) : null;
    },

    getAll: (): Record<string, any> => {
        const drafts: Record<string, any> = {};
        Object.keys(localStorage).forEach((key) => {
            if (key.startsWith(DRAFT_PREFIX)) {
                const keyValue = localStorage.getItem(key);
                if (keyValue) {
                    drafts[key] = JSON.parse(keyValue);
                }
            }
        });

        return drafts;
    },

    set: (key: DraftKey, value: any): void => {
        localStorage.setItem(key, JSON.stringify(value));
    },
};
