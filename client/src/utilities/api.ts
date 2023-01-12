import axios from 'axios';

const baseURL = process.env.API_URL || 'http://localhost:5141';

export const api = axios.create({ baseURL });

export const getAxiosConfig = (token: string) => {
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};
