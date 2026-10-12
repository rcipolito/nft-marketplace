export type User = {
    id: string;
    name: string;
    email: string;
};

export type LoginInput = {
    email: string;
    password: string;
};

export type LoginResponse = {
    user: User;
    token: string;
    expiresAt: number;
};

export type RegisterInput = {
    name: string;
    email: string;
    password: string;
};