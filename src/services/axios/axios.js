import axios from 'axios';
import { apiURl } from '../../utils/constants';
function createAxiosInstance(token ,role ) { //fn creates & configures Axios instances with optional authentication headers.
    const instance = axios.create({
        baseURL: apiURl,
    });
    if(token){
    instance.interceptors.request.use(
        
        (config) => {
            console.log("role in axios",role)
            console.log("token in axios",token)
            console.log("config",config)
            config.headers.Authorization = `Bearer ${localStorage.getItem(token)}`; // configures an interceptor to add an Authorization header with token value prefixed by Bearer 
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



function createFormDataAxiosInstance(token, role) {
    try {
        const instance = createAxiosInstance(token, role);
        instance.interceptors.request.use((config) => {
            if (config.headers['Content-Type'] === 'multipart/form-data') {
                return config;
            }
            config.headers['Content-Type'] = 'multipart/form-data';
            return config;
        });

        return instance;
    } catch (error) {
        console.error('Error creating FormData Axios instance:', error);
        return null;
    }
}



const axiosUserInstance = createAxiosInstance("token" , 'user');
const axiosAdminInstance = createAxiosInstance("adminToken" , 'admin');
const axiosFormDataInstance = createFormDataAxiosInstance("token" , 'user');
const axiosInstance = createAxiosInstance(null , null)


export {
    axiosUserInstance,
    axiosAdminInstance,
    axiosFormDataInstance,
    axiosInstance
};