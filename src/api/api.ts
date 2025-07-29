import axios from "axios";
import { BASE_URL } from "./urls";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    // accept: "*/*",
    "accept-language": "en",
    "Content-Type": "application/json",
    Authorization: "",
  },
});

export default api;
