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
exports.MainDialog = void 0;
const botbuilder_dialogs_1 = require("botbuilder-dialogs");
const botbuilder_adapter_facebook_1 = require("botbuilder-adapter-facebook");
const botbuilder_1 = require("botbuilder");
const hermes_1 = require("../apis/hermes");
const botContent_1 = require("../lib/botContent");
const helper_1 = require("../lib/helper");
const welcomeCardJson = require("../../resources/welcomeCard.json");
const TEXT_PROMPT = "TextPrompt";
const MAIN_WATERFALL_DIALOG = "GET_STARTED";
const CHOICE_PROMPT = "choicePrompt";
class MainDialog extends botbuilder_dialogs_1.ComponentDialog {
    constructor() {
        super("MainDialog");
        this.addDialog(new botbuilder_dialogs_1.TextPrompt(TEXT_PROMPT))
            .addDialog(new botbuilder_dialogs_1.ChoicePrompt(CHOICE_PROMPT))
            .addDialog(new botbuilder_dialogs_1.WaterfallDialog(MAIN_WATERFALL_DIALOG, [
            this.introStep.bind(this),
            this.finalStep.bind(this),
        ]));
        this.initialDialogId = MAIN_WATERFALL_DIALOG;
        this.adapterFB = new botbuilder_adapter_facebook_1.FacebookAdapter({
            verify_token: process.env.FACEBOOK_VERIFY_TOKEN,
            app_secret: process.env.FACEBOOK_APP_SECRET,
            access_token: process.env.FACEBOOK_ACCESS_TOKEN,
        });
        this.hotel = "";
    }
    /**
     * The run method handles the incoming activity (in the form of a DialogContext) and passes it through the dialog system.
     * If no dialog is active, it will start the default dialog.
     */
    run(context, accessor, userAccessor) {
        return __awaiter(this, void 0, void 0, function* () {
            const dialogSet = new botbuilder_dialogs_1.DialogSet(accessor);
            dialogSet.add(this);
            const dialogContext = yield dialogSet.createContext(context);
            const results = yield dialogContext.continueDialog();
            if (results.status === botbuilder_dialogs_1.DialogTurnStatus.empty) {
                yield dialogContext.beginDialog(this.id);
            }
            const { text } = context.activity;
            const userProfile = yield userAccessor.get(context, {});
            console.log(text);
            switch (text) {
                case "BOOK_ROOMS":
                    yield this.startBooking(context, userProfile);
                    break;
                case "GET_STARTED":
                    yield this.mainMenu(context, userProfile);
                    break;
                case "HOTEL_INFO":
                    yield this.hotelInfo(context, userProfile);
                    break;
                case "CALL_HOTEL":
                    yield this.callHotel(context, userProfile);
                    break;
                default:
                    break;
            }
            if (text && text.startsWith("SHOW_FACILITY")) {
                yield this.detailFacility(context, userProfile);
            }
        });
    }
    startBooking(context, userProfile) {
        return __awaiter(this, void 0, void 0, function* () {
            // let pageId = context.activity.recipient.id;
            const customerName = context.activity.from.name;
            const psId = context.activity.from.id;
            const channel = "facebook";
            try {
                const { hotel } = userProfile;
                const card = botContent_1.webviewBookingContent(psId, hotel, channel, customerName);
                yield context.sendActivity({ attachments: [card] });
            }
            catch (err) {
                // console.log(err);
            }
        });
    }
    mainMenu(context, userProfile) {
        return __awaiter(this, void 0, void 0, function* () {
            const psId = context.activity.from.id;
            const customerName = context.activity.from.name;
            const { hotel } = userProfile;
            try {
                const card = botContent_1.mainMenuContent(psId, hotel, customerName);
                const reply = yield context.sendActivity({ attachments: [card] });
                // var reference = TurnContext.getReplyConversationReference(
                //   context.activity,
                //   reply
                // );
                // console.log('reference', reference);
                // getConversationReference
            }
            catch (err) {
                console.log(err);
            }
        });
    }
    hotelInfo(context, userProfile) {
        return __awaiter(this, void 0, void 0, function* () {
            // let pageId = stepContext.context.activity.recipient.id;
            let pageId = 367359240646069;
            const customerName = context.activity.from.name;
            const psId = context.activity.from.id;
            let channel = context.activity.channelId;
            channel = helper_1.capitalizeFirstLetter(channel);
            if (channel === "Line") {
                pageId = 1654145898;
            }
            const res = yield hermes_1.getHotel(pageId, channel);
            const hotel = res.data.data;
            const resFacilities = yield hermes_1.getFacilities(pageId, channel);
            const facilities = resFacilities.data.data;
            try {
                const content = botContent_1.hotelInfoContent(psId, hotel, facilities);
                yield context.sendActivity({
                    attachmentLayout: botbuilder_1.AttachmentLayoutTypes.Carousel,
                    attachments: content,
                });
            }
            catch (err) {
                console.log(err);
            }
        });
    }
    callHotel(context, userProfile) {
        return __awaiter(this, void 0, void 0, function* () {
            // let pageId = stepContext.context.activity.recipient.id;
            let pageId = 367359240646069;
            const customerName = context.activity.from.name;
            const psId = context.activity.from.id;
            let channel = context.activity.channelId;
            channel = helper_1.capitalizeFirstLetter(channel);
            if (channel === "Line") {
                pageId = 1654145898;
            }
            const res = yield hermes_1.getHotel(pageId, channel);
            const hotel = res.data.data;
            try {
                const card = botContent_1.callHotelContent(psId, hotel, customerName);
                const welcomeCard = botbuilder_1.CardFactory.adaptiveCard(card);
                yield context.sendActivity({ attachments: [welcomeCard] });
            }
            catch (err) {
                console.log(err);
            }
        });
    }
    detailFacility(context, userProfile) {
        return __awaiter(this, void 0, void 0, function* () {
            let pageId = 367359240646069;
            const customerName = context.activity.from.name;
            const psId = context.activity.from.id;
            let channel = context.activity.channelId;
            channel = helper_1.capitalizeFirstLetter(channel);
            if (channel === "Line") {
                pageId = 1654145898;
            }
            const res = yield hermes_1.getFacilities(pageId, channel);
            const facilities = res.data.data;
            const { text } = context.activity;
            const id = text.split("-")[1];
            const facility = facilities.find((item) => item.id === id);
            yield context.sendActivity(facility.long_description);
        });
    }
    introStep(stepContext) {
        return __awaiter(this, void 0, void 0, function* () {
            const { text } = stepContext.context.activity;
            // const choices = ["Book rooms", "Main menu", "Hotel Info"];
            // const options: PromptOptions = {
            //   prompt: "Bạn muốn biết về điều gì ?",
            //   choices: choices
            // };
            // return await stepContext.prompt(CHOICE_PROMPT, options);
            return yield stepContext.next();
        });
    }
    finalStep(stepContext) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield stepContext.endDialog();
        });
    }
}
exports.MainDialog = MainDialog;
//# sourceMappingURL=mainDialog.js.map