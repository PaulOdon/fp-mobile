import axios from "axios"
import { API_URL } from "@env";

export const getDashboard = async (headerOptions) => {
    try {
        let response = await axios.get(API_URL + "/dashboard", headerOptions);
        if(response.status == 200 || response.status == 201) {
            return response.data;
        }
        return false;
    } catch (error) {
        console.log(error);
    }
}
