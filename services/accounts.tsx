"use client"

import { apiActions, apiMultipartActions } from "@/tools/axios"
import { AxiosResponse } from "axios";

interface signUp {
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    password_confirmation: string;
    phone_number: string;
    country: string;
}

interface User {
    email: string;
    first_name: string;
    last_name: string;
    username: string;
    avatar: string;
    phone_number: string;
    country: string;
    is_event_manager: boolean;
    is_staff: boolean;
    is_active: boolean;
}

interface updateUser {
    first_name: string;
    last_name: string;
    avatar: File;
    phone_number: string;
    country: string;
}

interface forgotPassword {
    email: string;
}

interface resetPassword {
    email: string;
    code: string;
    password: string;
    password_confirmation: string;
}

export const signUp = async (data: signUp): Promise<User> => {
    const response: AxiosResponse<User> = await apiActions.post(`/api/v1/auth/signup/event-manager/`, data)
    return response.data
}

export const getAccount = async (username: string, headers: { headers: { Authorization: string } }): Promise<User> => {
    const response: AxiosResponse<User> = await apiActions.get(`/api/v1/auth/${username}/`, headers)
    return response.data
}

export const updateAccount = async (username: string, formData: updateUser | FormData, headers: { headers: { Authorization: string } }): Promise<User> => {
    const response: AxiosResponse<User> = await apiMultipartActions.patch(`/api/v1/auth/${username}/`, formData, headers)
    return response.data
}

export const forgotPassword = async (data: forgotPassword): Promise<User> => {
    const response: AxiosResponse<User> = await apiActions.post(`/api/v1/auth/password/reset/`, data)
    return response.data
}

export const resetPassword = async (data: resetPassword): Promise<User> => {
    const response: AxiosResponse<User> = await apiActions.post(`/api/v1/auth/password/reset/confirm/`, data)
    return response.data
}
