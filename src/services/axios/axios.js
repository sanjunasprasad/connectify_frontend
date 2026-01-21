import axios from 'axios';
import { apiURl } from '../../utils/constants';
function createAxiosInstance(token ,role ) { //fn creates & configures Axios instances with optional authentication headers.
    const instance = axios.create({
        baseURL: apiURl,
    });
    if( token && token.trim()){
    instance.interceptors.request.use(
        
        (config) => {
            // console.log("role in axios",role)
            // console.log("token in axios",token)
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



const axiosUserInstance = createAxiosInstance("token" );
const axiosAdminInstance = createAxiosInstance("adminToken");
const axiosInstance = createAxiosInstance(null , null)


export {
    axiosUserInstance,
    axiosAdminInstance,
    axiosInstance
};