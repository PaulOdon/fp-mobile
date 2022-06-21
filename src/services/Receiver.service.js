import axios from 'axios';
import { API_URL } from "@env";

export const getOneReceiver = async (id, headerOptions) => {
    try {
        const response = await axios.get(API_URL + `/receiver/${id}`, headerOptions);
        if (response.status === 200 || response.status === 201) return response.data;
        else return false;
    } catch (error) {
        console.log(error);
    }
};
