import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { UserLogin } from "../db/types.js";
const sessions = new Map<string, UserSession>()
const userSessions: Record<number, Array<string>> = {}
export type UserSession = {
    sessionId: string;
    expiresAt: Date;
    
} & UserLogin



export default class SessionService {
    static GenerateSessionToken(): string {
        const bytes = new Uint8Array(20);
        crypto.getRandomValues(bytes);
        const token = encodeBase32LowerCaseNoPadding(bytes);
        return token;
    }

    static CreateSession(token: string,login: UserLogin): Promise<UserSession> {
        const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
        const session: UserSession = {
            ...login,
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
            sessionId,
        };

        sessions.set(
            `session:${session.sessionId}`,
            session
        );
        if (userSessions[login.user!.id] == undefined) {
            userSessions[login.user!.id] = new Array()
        }
        userSessions[login.user!.id].push(sessionId)

        return Promise.resolve(session);
    }

    static ValidateSessionToken(token: string): Promise<UserSession | null> {
        const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
        const session = sessions.get(`session:${sessionId}`);
        if (session == undefined) {
            return Promise.resolve(null);
        }

        if (Date.now() >= session.expiresAt.getTime()) {
            sessions.delete(`session:${sessionId}`);
            userSessions[session.userId].splice(userSessions[session.userId].indexOf(session.sessionId), 1)
            return Promise.resolve(null);
        }
        if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
            session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

            sessions.set(
                `session:${session.id}`,
                session
            );
        }
        return Promise.resolve(session);
    }

    static InvalidateSession(sessionId: string, userId: number): Promise<void> {
        sessions.delete(`session:${sessionId}`);
        userSessions[userId].splice(userSessions[userId].indexOf(sessionId), 1)
        return Promise.resolve()
    }

    static InvalidateAllSessions(userId: number): Promise<void> {
        const uSessions = userSessions[userId]

        if (uSessions != undefined) {
            for (const s of uSessions) {
                sessions.delete(s)
            }
        }
        return Promise.resolve()
    }
}
