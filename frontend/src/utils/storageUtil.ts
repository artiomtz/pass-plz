import User from '@models/user';

const ACCESS_TOKEN_KEY = 'pass_plz_access_token';
const REFRESH_TOKEN_KEY = 'pass_plz_refresh_token';
const RESET_TOKEN_KEY = 'pass_plz_reset_token';
const USER_KEY = 'pass_plz_user';

// export const DRAFT_PREFIX_ID = `${DRAFT_PREFIX}_`
export const DRAFT_PREFIX = 'pass_plz_draft_';
export const DRAFT_PREFIX_NEW = `${DRAFT_PREFIX}new`;
type DraftKey = `${typeof DRAFT_PREFIX_NEW}` | `${typeof DRAFT_PREFIX}${number}`;

export const getAccessToken = (): string | null => {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const setAccessToken = (token: string) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

export const getRefreshToken = (): string | null => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const setRefreshToken = (token: string) => {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
};

export const getResetToken = (): string | null => {
    return localStorage.getItem(RESET_TOKEN_KEY);
};

export const setResetToken = (token: string) => {
    localStorage.setItem(RESET_TOKEN_KEY, token);
};

export const clearTokens = () => {
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
    get: (key: DraftKey) => {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
    },
    set: (key: DraftKey, value: any) => {
        localStorage.setItem(key, JSON.stringify(value));
    },
    clear: (id: number) => {
        const key = getDraftKey(id);
        localStorage.removeItem(key);
        // localStorage.removeItem(`${DRAFT_PREFIX}_${id}`);
    },
    // clearNew: () => {
    //     localStorage.removeItem(`${DRAFT_PREFIX}_new`);
    // },
    clearAll: () => {
        Object.keys(localStorage)
            .filter((k) => k.startsWith(DRAFT_PREFIX))
            .forEach((k) => localStorage.removeItem(k));
    },

    getAll: () => {
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
};
