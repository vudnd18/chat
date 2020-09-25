"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFacilities = exports.getCustomer = exports.getHotel = void 0;
const axios_1 = __importDefault(require("axios"));
const url = `${process.env.HERMES_URL}/api/v2/chatbot`;
exports.getHotel = (pageId, channel) => {
    return axios_1.default.get(`${url}/hotel?pageId=${pageId}&channel=${channel}`);
};
exports.getCustomer = (pageId, userChannelId, channel) => {
    return axios_1.default.get(`${url}/customer?pageId=${pageId}&channel=${channel}&userChannelId=${userChannelId}`);
};
exports.getFacilities = (pageId, channel) => {
    return axios_1.default.get(`${url}/facilities?pageId=${pageId}&channel=${channel}`);
};
//# sourceMappingURL=hermes.js.map