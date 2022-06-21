import axios from "axios"
import { API_URL } from "@env";

export const postMail = async (mail) => {
    try {
        let respose = await axios.post(API_URL + "/mail", mail);
        if(respose.status == 200 || respose.status == 201) {
            return respose.data;
        }
        return false;
    } catch (error) {
        console.log(error);
    }
}

export const putMail = async (id, mail, headerOption) => {
    try {
        let respose = await axios.put(API_URL + `/mail/${id}`, mail, headerOption);
        if(respose.status == 200 || respose.status == 201) {
            return respose.data;
        }
        return false;
    } catch (error) {
        console.log(error);
    }
}

export const getMailByCourseId = async (id, headerOption) => {
    try {
        let respose = await axios.get(API_URL + `/mail/course/${id}`,headerOption);
        if(respose.status == 200 || respose.status == 201) {
            return respose.data;
        }
        return false;
    } catch (error) {
        console.log(error);
    }
}