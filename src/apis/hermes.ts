import axios from 'axios';

const url = `${process.env.HERMES_URL}/chatbot`;

export const getInfo = (fbPageId, userChannelId) => {
  return axios.get(`${url}/customer-info?fbPageId=${fbPageId}&userChannelId=${userChannelId}`);
}
