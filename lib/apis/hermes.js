"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInfo = void 0;
const axios_1 = __importDefault(require("axios"));
const url = `${process.env.HERMES_URL}/chatbot`;
exports.getInfo = (fbPageId, userChannelId) => {
    return axios_1.default.get(`${url}/customer-info?fbPageId=${fbPageId}&userChannelId=${userChannelId}`);
};
//# sourceMappingURL=hermes.js.map