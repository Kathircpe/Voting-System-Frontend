import {api} from './api';

export const authService={
    async login(credentials){
        const response=await api.post('/auth/login',credentials);
        return response.data;
    },
    async signUp(credentials){
        const response=await api.post('/auth/registration',credentials);
        return response.data;
    },
    async verifyAccount(credentials){
        const response=await api.post('/auth/verify-account',credentials);
        return response.data;
    },
    async generateOtp(email){
        const response=await api.post(`/auth/forgot-password/${email}`);
        return response.data;
    },
    async forgotPassword(credentials){
        const response=await api.post('/auth/forgot-password',credentials);
        return response.data;
    },
};