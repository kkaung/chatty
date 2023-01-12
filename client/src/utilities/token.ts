import jwt_decode from 'jwt-decode';

export function decodeToken(token: string) {
    return jwt_decode<any>(token);
}

export function storeToken(token: string) {
    localStorage.setItem('token', token);
}

export function getToken() {
    return localStorage.getItem('token');
}

export function removeToken() {
    const token = localStorage.getItem('token');

    if (!token) return console.error('Unalble to remove token');

    localStorage.removeItem('token');
}

export function getUserId(): string {
    const token = getToken()!;
    const decode = decodeToken(token);

    const uid = decode.nameid;

    return uid;
}
