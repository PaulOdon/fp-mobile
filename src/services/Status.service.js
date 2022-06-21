import axios from "axios"
import { API_URL } from "@env";

export const getAllStatus = async (headerOptions) => {
    console.log("axios")
    console.log(headerOptions)
    console.log(API_URL)
    try {
        const respose = await axios.get(API_URL + "/status", headerOptions);
        // console.log(respose.data);
        // if (respose.status == 200 || respose.status == 201) {
        //     return respose.data;
        // }
        return respose.data;
    } catch (error) {
        console.log(error);
    }
}

