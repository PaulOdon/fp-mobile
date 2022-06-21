import axios from "axios";
import { API_URL } from "@env";


export const login = async (data) => {
    console.log(API_URL )
    try {
        let response = await axios.post(API_URL + "/auth/login", data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getLogedUser = async (headerOptions) => {
    try {
        const respose = await axios.get(API_URL + "/auth/get-user", headerOptions);
        return respose.data;
    } catch (error) {
        if (error.response) {
            throw error.response.data;
        }
    }
}

export const checkAPI = async () => {
    try {
        const res = await axios.get(API_URL);
        return res;
    } catch (error) {
        if (error) {
            throw error;
        }
    }
}
