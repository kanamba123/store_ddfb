import axios from "axios";
import { API_URL } from "./API";


export const API = axios.create({
    baseURL:API_URL
})