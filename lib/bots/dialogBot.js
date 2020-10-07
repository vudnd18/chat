"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DialogBot = void 0;
const botbuilder_1 = require("botbuilder");
const hermes_1 = require("../apis/hermes");
const helper_1 = require("../lib/helper");
const CONVERSATION_DATA_PROPERTY = "CONVERSATION_DATA_PROPERTY";
const USER_PROPERTY = "USER_PROPERTY";
class DialogBot extends botbuilder_1.ActivityHandler {
    constructor(conversationState, userState, dialog) {
        super();
        this.conversationState = conversationState;
        this.userState = userState;
        this.dialog = dialog;
        this.dialogState = this.conversationState.createProperty("DialogState");
        this.conversationDataAccessor = conversationState.createProperty(CONVERSATION_DATA_PROPERTY);
        this.userAccessor = userState.createProperty(USER_PROPERTY);
        this.onMessage((context, next) => __awaiter(this, void 0, void 0, function* () {
            console.log("Running dialog with Message Activity.");
            const userProfile = yield this.userAccessor.get(context, {});
            let pageId = 367359240646069;
            let channel = context.activity.channelId;
            channel = helper_1.capitalizeFirstLetter(channel);
            if (channel == "Line") {
                pageId = 1654145898;
            }
            if (!userProfile.hotel) {
                try {
                    const res = yield hermes_1.getHotel(pageId, channel);
                    const hotelInfo = res.data.data;
                    userProfile.hotel = hotelInfo;
                }
                catch (error) {
                    const { response } = error;
                    const { statusText } = response;
                    console.log("Get Hotel", statusText);
                }
            }
            if (!userProfile.facilites) {
                try {
                    const res = yield hermes_1.getFacilities(pageId, channel);
                    const facilites = res.data.data;
                    userProfile.facilites = facilites;
                }
                catch (error) {
                    const { response } = error;
                    const { statusText } = response;
                    console.log("Get Facilities", statusText);
                }
            }
            if (!userProfile.name) {
                userProfile.name = context.activity.from.name;
            }
            // Run the Dialog with the new message Activity.
            yield this.dialog.run(context, this.dialogState, this.userAccessor);
            // By calling next() you ensure that the next BotHandler is run.
            yield next();
        }));
        this.onDialog((context, next) => __awaiter(this, void 0, void 0, function* () {
            // Save any state changes. The load happened during the exceution of Dialog.
            yield this.conversationState.saveChanges(context, false);
            yield this.userState.saveChanges(context, false);
            // By calling next() you ensure that the next BotHandler is run.
            yield next();
        }));
    }
}
exports.DialogBot = DialogBot;
//# sourceMappingURL=dialogBot.js.map