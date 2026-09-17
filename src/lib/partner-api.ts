import axios from 'axios';
export const partnerApi=axios.create({baseURL:process.env.NEXT_PUBLIC_API_URL??'/api',timeout:10000});
partnerApi.interceptors.request.use(config=>{if(typeof window!=='undefined'){const token=localStorage.getItem('akola:partner-token');if(token)config.headers.Authorization=`Bearer ${token}`}return config});
