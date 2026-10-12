import axios from "axios";
import { getValidSession } from "@/utils/session";

export const api = axios.create({
    baseURL: "/api",
});

api.interceptors.request.use((config) => {
    const session = getValidSession();

    if (session) {
        config.headers.Authorization = `Bearer ${session.token}`;
    }

    return config;
});