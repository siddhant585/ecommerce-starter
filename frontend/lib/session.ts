const TOKEN_KEY = 'auth_token';
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';
export function getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
}

export async function initSession(): Promise<void> { 
    if (getToken()) { 
        return; //already have a token
    }
    const res = await fetch(`${API_BASE}/sessions/`, {method: 'POST'});
    const data = await res.json();
    setToken(data.token);
}