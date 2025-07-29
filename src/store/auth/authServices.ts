import { APIPATH } from "../../api/urls";
import { getApi, postApi } from "@/services/services";
// import { toast } from "react-toastify";


export const loginApi = async (
  payload: { mobile: string},
  token?: string,
  logout?: () => void
) => {
  return await postApi(APIPATH.login, payload, token, logout);
};
export const verifyOtpApi = async (
  payload: { mobile: string; otp: string },
  token?: string,
  logout?: () => void
) => {
  return await postApi(APIPATH.verifyOtp, payload, token, logout);
};
export const getProfileApi = async (token: string, logout: () => void) => {
  return await getApi(APIPATH.getProfile, token, logout);
};


