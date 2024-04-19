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
        console.log("token in forminstance",token)
        console.log("role in forminstance",role)
        const instance = createAxiosInstance(token, role);
        console.log(instance,'>>>>>>>>>')
        if(instance){
            instance.interceptors.request.use((config) => {
                if (config.headers['Content-Type'] === 'multipart/form-data') {
                    // No need to set headers for multipart form data
                    return config;
                }
                config.headers['Content-Type'] = 'multipart/form-data';
                console.log("config",config)
                return config;
            });
    
            return instance;
        }else {
            console.log(111111);
        }
       
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