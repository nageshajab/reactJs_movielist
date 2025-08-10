import axios from 'axios';
import { API_URL } from "../config"
import { subscription_key } from "../config";

const api = axios.create({
      baseURL: API_URL,
      headers: {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": subscription_key,
      },
});
export const createmovie = (data: any) => api.post(`/createmovie`, data);
export const GetMovies = (data: any) => api.post(`/GetMovies`, data);
export const GetAllTags = (data: any) => api.post(`/GetAllTags`, data);
export const getMovie = (id: string) => api.get(`/getMovie?id=${id}`);
export const GetImage = (id: string) => api.get(`/GetImage?id=${id}`);
export const updateMovie = ( data: any) => api.post(`/updateMovie`, data);
export const DeleteMovie = (id: string) => api.post(`/DeleteMovie?id=${id}`);
