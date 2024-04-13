import axios from 'axios';
import { apiURl } from '../../utils/constants';
function createAxiosInstance(token ,role ) { //fn creates & configures Axios instances with optional authentication headers.
    const instance = axios.create({
        baseURL: apiURl,
    });
    if(token){
    instance.interceptors.request.use(
        (config) => {
            config.headers.Authorization = `Bearer ${token}`; // configures an interceptor to add an Authorization header with token value prefixed by Bearer 
            config.headers.role = role;// adds a custom header named 'role' with the specified role 
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
      );
    }
    return instance;
}
const userToken = localStorage.getItem('token');
const adminToken = localStorage.getItem('adminToken');
const axiosUserInstance = createAxiosInstance(userToken , 'user');
const axiosAdminInstance = createAxiosInstance(adminToken , 'admin');
const axiosInstance = createAxiosInstance(null , null)

export {
    axiosUserInstance,
    axiosAdminInstance,
    axiosInstance
};