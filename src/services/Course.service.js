import axios from "axios"
import { API_URL } from "@env";

export const getAllCourse = async (headerOptions) => {
    try {
        let respose = await axios.get(API_URL + "/course", headerOptions);
        if (respose.status == 200 || respose.status == 201) {
            return respose.data;
        }
        return false;
    } catch (error) {
        console.log(error);
    }
}

export const putCourse = async (id, course, headerOptions) => {
    try {
        let res = await axios.put(API_URL + `/course/${id}`, course, headerOptions);
        return res.data
        // if (res.status == 200 || res.status == 201) {
            
        // } else return false;
    } catch (error) {
        console.log(error);
    }
}

export const getCourseById = async (courseURL, headerOptions) => {
    try {
        let respose = await axios.get(API_URL + `${courseURL}`, headerOptions);
        if (respose.status == 200 || respose.status == 201) {
            return respose.data;
        }
        return false;
    } catch (error) {
        console.log(error);
    }
}

export const getAllCourseByCustomerId = async (id, headerOptions) => {
    try {
        let respose = await axios.get(API_URL + `/course/customer/${id}`, headerOptions);
        if (respose.status == 200 || respose.status == 201) {
            return respose.data;
        }
        return false;
    } catch (error) {
        console.log(error);
    }
}

export const postFileImage = async (file, headerOptions, id) => {
    try {
        let response = await axios.post(`${API_URL}/file/upload/${id}`, file, headerOptions);
        if (response.status === 200 || response.status === 201) {
            return response.data;
        } else {
            console.log("response ", response);
            return response;
        }
    } catch (error) {
        console.log("catch error : ", error);
    }
}

export const baseUrl = () => {
    return API_URL;
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
