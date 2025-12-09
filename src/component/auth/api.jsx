import axios from 'axios';
import {useNavigate} from 'react-router-dom';
const API_BASE_URL='https://voting-system-aztp.onrender.com/api/v1';

export const api=axios.create({
    baseURL:API_BASE_URL,
    headers:{
        'Content-Type': 'application/json',
    },
});

//add token to every request
api.interceptors.request.use(
    (config)=>{
        const token=localStorage.getItem('token');
        
        if (token && !config.url.includes('/auth/')) {
    config.headers.Authorization = `Bearer ${token}`;
}

        return config;
    },
    (error)=>{
        return Promise.reject(error);
    }
);

//token expiration
// api.interceptors.response.use(
//     (response)=> response,
//     (error)=>{
//         if(error.response?.status===401){
//              const navigate=useNavigate();
//             localStorage.removeItem('token');
//             navigate('/login');
//         }
//         return Promise.reject(error);
//     }
// );