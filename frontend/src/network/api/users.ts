import { User } from "@/models/user";
import api from "@/network/axiosInstance";

export async function getAuthenticatedUser() {
    const response = await api.get<User>("/users/me");
    return response.data;
}

export async function getUserByUsername(username: string) {
    const response = await api.get<User>("/users/profile/" + username);
    return response.data;
}

interface SignUpValues {
    username: string,
    email: string,
    password: string,
    verificationCode: string,
}

export async function signUp(credentials: SignUpValues) {
    const response = await api.post<User>("/users/signup", credentials);
    return response.data;
}

export async function requestEmailVerificationCode(email: string) {
    await api.post("/users/verification-code", { email });
}

export async function requestPasswordResetCode(email: string) {
    await api.post("/users/reset-password-code", { email });
}

interface ResetPasswordValues {
    email: string,
    password: string,
    verificationCode: string,
}

export async function resetPassword(credentials: ResetPasswordValues) {
    const response = await api.post<User>("/users/reset-password", credentials);
    return response.data;
}

interface LoginValues {
    username: string,
    password: string,
}

export async function login(credentials: LoginValues) {
    const response = await api.post<User>("/users/login", credentials);
    return response.data;
}

export async function logout() {
    await api.post("/users/logout");
}

interface UpdateUserValues {
    username?: string,
    displayName?: string,
    about?: string,
    profilePic?: File,
}

export async function updateUser(input: UpdateUserValues) {
    const formData = new FormData();
    Object.entries(input).forEach(([key, value]) => {
        if (value !== undefined) formData.append(key, value);
    });
    const response = await api.patch<User>("/users/me", formData);
    return response.data;
}