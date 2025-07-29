import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import api from "./api";

const setUpInterceptor = () => {
  api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const tempConfig = config;
      tempConfig.headers.Authorization = "token";

      return tempConfig;
    },
    (error: AxiosError) => {
      console.log(error.response!.status);
      Promise.reject(error);
    }
  );
  api.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );
};

export default setUpInterceptor;
