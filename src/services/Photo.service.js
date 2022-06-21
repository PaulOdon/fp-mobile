import { API_URL } from '@env';
import RNFetchBlob from 'rn-fetch-blob'

export const getImage = async (url, headerOptions) => {
  try {
    const token = headerOptions.headers.Authorization.split(' ', 2);
    let response = await RNFetchBlob.fetch('GET', API_URL + '/' + url, {
      Authorization: `Bearer ${token[1]}`,
    });
    return response.base64();
  } catch (error) {
    console.log(error);
  }
};
