import {api} from "@/lib/api";

export interface User{
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    image: string;
    phone?: string;
    gender?: string;
    age?: number,
    birthDate?: string;
    height?: number;
    weight?: number;
    address?: {
        address: string;
        city: string;
        state: string;
        country: string;
    };
    company?: {
        name: string;
        title: string;
        department: string;
    };
}

export interface UpdateUserInput {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
}

export async function getCurrentUser(): Promise<User> {
    return api.get<User>("/auth/me");
}

export async function updateUser(id: number,data: UpdateUserInput):Promise<User> {
    return api.put<User>(`/users/${id}`, data);
}