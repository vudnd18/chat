import axios from 'axios';

const url = `${process.env.HERMES_URL}/api/v2/chatbot`;

export const getHotel = (pageId, channel) => {
  return axios.get(`${url}/hotel?pageId=${pageId}&channel=${channel}`);
}

export const getCustomer = (pageId, userChannelId, channel) => {
  return axios.get(`${url}/customer?pageId=${pageId}&channel=${channel}&userChannelId=${userChannelId}`);
}

export const getFacilities = (pageId, channel) => {
  return axios.get(`${url}/facilities?pageId=${pageId}&channel=${channel}`);
}
