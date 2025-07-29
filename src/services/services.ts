/* eslint-disable @typescript-eslint/no-explicit-any */
import instance from './axiosInterceptors';
import { toast } from "react-toastify";

export const postApi = async (url: any, formData?: any, token?: any, logout?: any, type=0) => {
  const options: any = {
    headers: {
      Accept: type ? 'multipart/form-data' : 'application/json',
      'Content-Type': type ? 'multipart/form-data' : 'application/json',
    },
  };

  if (token) {
    options.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await instance.post(url, formData, options);
    if (response.data.success === 0) {
      toast.success(response.data.message);
    }
    return response.data;
  } catch (error) {
    handleApiError(error, logout);
  }
};

export const putApi = async (url: any, formData: any, token: any, logout: any, type = 0) => {
  const options: any =  {
    headers: {
      Accept: type ? 'multipart/form-data' : 'application/json',
      'Content-Type': type ? 'multipart/form-data' : 'application/json',
    },
  };

  if (token) {
    options.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await instance.put(url, formData, options);
    return response.data;
  } catch (error) {
    handleApiError(error, logout);
  }
};

export const getApi = async (url: any, token: any, logout: any) => {
  const options: any =  {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };

  if (token) {
    options.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await instance.get(url, options);
    return response.data;
  } catch (error) {
    handleApiError(error, logout);
    return error;
  }
};

export const deleteApi = async (url: any, token: any) => {
  const options: any =  {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };

  if (token) {
    options.headers.Authorization = `Bearer ${token}`;
  }

  options.headers.demo = 'Bearer';

  try {
    const response = await instance.delete(url, options);
    if (response.data.status === 0) {
      toast.success(response.data.message);
    }
    return response.data;
  } catch (error) {
    return error;
  }
};

const handleApiError = (error: any, logout: any) => {
  if (error.response && error.response.status === 401) {
    logout();
  } else if (error.response && error.response.status === 500) {
    toast.error('Network error, please try again later');
  } else {
    toast.error(error.response.data.message);
  }
};
