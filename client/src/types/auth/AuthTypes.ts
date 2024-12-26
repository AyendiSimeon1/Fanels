
export interface User {
    id: string;
    email: string;
    password: string;
}

export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    loading: boolean;
}