"use client"

import { apiActions, apiMultipartActions } from "@/tools/axios"
import { AxiosResponse } from "axios"

interface createCompany {
    name: string
}

interface Company {
    name: string,
    manager: string,
    company_code: string,
    logo: string,
    banner: string,
    country: string,
    city: string,
    address: string,
    phone: string,
    email: string,
    website: string,
    created_at: string,
    updated_at: string,
    reference: string
}

interface updateCompany {
    name: string,
    logo: File,
    banner: File,
    country: string,
    city: string,
    address: string,
    phone: string,
    email: string,
    website: string,
}

export const createCompany = async (data: createCompany, headers: { headers: { Authorization: string } }): Promise<Company> => {
    const response: AxiosResponse<Company> = await apiActions.post(`/api/v1/company/`, data, headers)
    return response.data
}

export const getCompanies = async (headers: { headers: { Authorization: string } }): Promise<Company[]> => {
    const response: AxiosResponse<Company[]> = await apiActions.get(`/api/v1/company/`, headers)
    return response.data
}

export const getCompany = async (reference: string, headers: { headers: { Authorization: string } }): Promise<Company> => {
    const response: AxiosResponse<Company> = await apiActions.get(`/api/v1/company/${reference}/`, headers)
    return response.data
}

export const updateCompany = async (reference: string, formData: updateCompany | FormData, headers: { headers: { Authorization: string } }): Promise<Company> => {
    const response: AxiosResponse<Company> = await apiMultipartActions.patch(`/api/v1/company/${reference}/`, formData, headers)
    return response.data
}
