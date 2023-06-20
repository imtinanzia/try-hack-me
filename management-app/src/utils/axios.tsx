import axios from 'axios';
import { SERVER_URL } from '../constants';

axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

const accessToken: string = localStorage.getItem('accessToken') as string;

const token = accessToken ?? '';
axios.defaults.headers.common.Authorization = token;
const axiosInstance = axios.create({
  baseURL: SERVER_URL,
});

axiosInstance.interceptors.response.use(
  (res) =>
    new Promise((resolve, reject) => {
      resolve(res);
    }),
  (error) => {
    if (!error.response) {
      return new Promise((resolve, reject) => {
        reject(error);
      });
    }

    if (error.response.status === 401) {
      console.log('hello');
    } else {
      return new Promise((resolve, reject) => {
        reject(error);
      });
    }
  }
);

export default axiosInstance;
