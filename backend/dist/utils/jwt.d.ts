interface TokenPayload {
    adminId: number;
    username: string;
}
export declare function generateToken(payload: TokenPayload): string;
export declare function verifyToken(token: string): TokenPayload;
export {};
//# sourceMappingURL=jwt.d.ts.map