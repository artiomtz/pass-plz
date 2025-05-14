export interface Authentication {
    accessToken: string;
    refreshToken: string;
    lastVisited: string; // ISO 8601
    userId: number;
}
