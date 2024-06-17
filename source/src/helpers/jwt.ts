import { jwtDecode } from "jwt-decode";

export function isTokenStillFresh(tokenString: string): boolean {
    const jwtPayload = parseJWT(tokenString);
    if (jwtPayload) {
        return Math.floor(Date.now() / 1000) < new Date(jwtPayload.exp).getTime();
    } else {
        return false;
    }
}

export function parseJWT(tokenString: string): JWT.Payload | null {
    try {
        return jwtDecode<JWT.Payload>(tokenString);
    } catch {
        return null;
    }
}
