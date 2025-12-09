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
        const response=await api.post('/auth/vo/verification',credentials);
        return response.data;
    },
    async generateOtpVo(email){
        const response=await api.post(`/auth/vo/${email}`);
        return response.data;
    },
    async generateOtpAd(email){
        const response=await api.post(`/auth/ad/${email}`);
        return response.data;
    },
    async forgotPassword(credentials){
        const response=await api.post('/auth/forgotPassword',credentials);
        return response.data;
    },
};