import axios from "axios";
import { api } from "./api";

import type { User } from "@/types/auth";

import type {
    LoginInput,
    LoginResponse,
} from "@/types/auth";

import type { RegisterInput } from "@/types/auth";

export async function buscarUsuarioAtual(): Promise<User> {
    const response = await api.get<User>("/auth/me");
    return response.data;
}

export async function logout(): Promise<void> {
    await api.post("/auth/logout");
}

export async function register(
    input: RegisterInput
): Promise<LoginResponse> {
    const response = await axios.post<LoginResponse>(
        "/api/auth/register",
        input
    );

    return response.data;
}

export async function login(
    input: LoginInput
): Promise<LoginResponse> {
    const response = await axios.post<LoginResponse>(
        "/api/auth/login",
        input
    );

    return response.data;
}