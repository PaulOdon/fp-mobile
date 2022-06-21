import axios from "axios";
import { API_URL } from "@env";

export const getOneCustomer = async (id, headerOptions) => {
    try {
        const res = await axios.get(API_URL + `/customer/${id}`, headerOptions);
        if (res.status === 200 || res.status === 201) {
            return res.data;
        } else return false;
    } catch (error) {
        console.log(error);
    }
};