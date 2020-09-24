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
const hermes_1 = require("../apis/hermes");
const facebookContent_1 = require("../lib/facebookContent");
const botContent_1 = require("../lib/botContent");
const welcomeCardJson = require("../../resources/welcomeCard.json");
const TEXT_PROMPT = 'TextPrompt';
const MAIN_WATERFALL_DIALOG = 'GET_STARTED';
class MainDialog extends botbuilder_dialogs_1.ComponentDialog {
    constructor(startedDialog) {
        super('MainDialog');
        this.addDialog(new botbuilder_dialogs_1.TextPrompt(TEXT_PROMPT))
            // .addDialog(startedDialog)
            .addDialog(new botbuilder_dialogs_1.WaterfallDialog(MAIN_WATERFALL_DIALOG, [
            this.introStep.bind(this),
            this.finalStep.bind(this)
        ]));
        this.initialDialogId = MAIN_WATERFALL_DIALOG;
        this.adapterFB = new botbuilder_adapter_facebook_1.FacebookAdapter({
            verify_token: process.env.FACEBOOK_VERIFY_TOKEN,
            app_secret: process.env.FACEBOOK_APP_SECRET,
            access_token: process.env.FACEBOOK_ACCESS_TOKEN
        });
        this.hotel = '';
    }
    /**
     * The run method handles the incoming activity (in the form of a DialogContext) and passes it through the dialog system.
     * If no dialog is active, it will start the default dialog.
     */
    run(context, accessor) {
        return __awaiter(this, void 0, void 0, function* () {
            const dialogSet = new botbuilder_dialogs_1.DialogSet(accessor);
            dialogSet.add(this);
            const dialogContext = yield dialogSet.createContext(context);
            const results = yield dialogContext.continueDialog();
            if (results.status === botbuilder_dialogs_1.DialogTurnStatus.empty) {
                yield dialogContext.beginDialog(this.id);
            }
        });
    }
    introStep(stepContext) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.hotel) {
                this.hotel = 'vudnd';
            }
            const { text } = stepContext.context.activity;
            console.log(text);
            switch (text) {
                case 'BOOK_ROOMS':
                    yield this.startBooking(stepContext);
                    break;
                case 'GET_STARTED':
                    yield this.mainMenu(stepContext);
                    break;
                case 'HOTEL_INFO':
                    yield this.hotelInfo(stepContext);
                    break;
                case 'CALL_HOTEL':
                    yield this.callHotel(stepContext);
                    break;
                default:
                    break;
            }
            return yield stepContext.next();
        });
    }
    finalStep(stepContext) {
        return __awaiter(this, void 0, void 0, function* () {
            // return await stepContext.replaceDialog(this.initialDialogId, { restartMsg: 'What else can I do for you?' });
            console.log(stepContext);
            return yield stepContext.endDialog();
        });
    }
    startBooking(stepContext) {
        return __awaiter(this, void 0, void 0, function* () {
            const customerName = stepContext.context.activity.from.name;
            const psId = stepContext.context.activity.from.id;
            // const fbPageId = stepContext.context.activity.recipient.id;
            const fbPageId = 367359240646069;
            const res = yield hermes_1.getInfo(fbPageId, psId);
            const { hotel, customer } = res.data.data;
            try {
                // const apiFB = await this.adapterFB.getAPI(stepContext.context.activity);
                // const queryFB = generateWebviewBooking(psId, hotel, customerName);
                // await apiFB.callAPI('/me/messages', 'POST', queryFB);
                const card = botContent_1.webviewBooking(psId, hotel, customerName);
                yield stepContext.context.sendActivity({ attachments: [card] });
            }
            catch (err) {
                console.log(err);
            }
        });
    }
    mainMenu(stepContext) {
        return __awaiter(this, void 0, void 0, function* () {
            const customerName = stepContext.context.activity.from.name;
            const psId = stepContext.context.activity.from.id;
            // const fbPageId = stepContext.context.activity.recipient.id;
            const fbPageId = 367359240646069;
            const res = yield hermes_1.getInfo(fbPageId, psId);
            const { hotel, customer } = res.data.data;
            const card = botContent_1.mainMenuInfo(hotel);
            // await stepContext.context.sendActivity({ attachments: [card] });
            try {
                const apiFB = yield this.adapterFB.getAPI(stepContext.context.activity);
                const menuWelcome = facebookContent_1.menuWelcomeMessage(psId, hotel);
                const menuButton = facebookContent_1.menuButtonMessage(psId, hotel, customerName);
                yield apiFB.callAPI('/me/messages', 'POST', menuWelcome);
                yield apiFB.callAPI('/me/messages', 'POST', menuButton);
            }
            catch (err) {
                console.log(err);
            }
        });
    }
    hotelInfo(stepContext) {
        return __awaiter(this, void 0, void 0, function* () {
            const customerName = stepContext.context.activity.from.name;
            const psId = stepContext.context.activity.from.id;
            // const fbPageId = stepContext.context.activity.recipient.id;
            const fbPageId = 367359240646069;
            const res = yield hermes_1.getInfo(fbPageId, psId);
            const { hotel, customer } = res.data.data;
            const resFacilities = yield hermes_1.getFacilitiesByHotelId(fbPageId);
            const facilities = resFacilities.data.data;
            try {
                const content = facebookContent_1.hotelInfoMessage(psId, hotel, facilities);
                const apiFB = yield this.adapterFB.getAPI(stepContext.context.activity);
                yield apiFB.callAPI('/me/messages', 'POST', content);
            }
            catch (err) {
                console.log(err);
            }
        });
    }
    callHotel(stepContext) {
        return __awaiter(this, void 0, void 0, function* () {
            const customerName = stepContext.context.activity.from.name;
            const psId = stepContext.context.activity.from.id;
            // const fbPageId = stepContext.context.activity.recipient.id;
            const fbPageId = 367359240646069;
            const res = yield hermes_1.getInfo(fbPageId, psId);
            const { hotel, customer } = res.data.data;
            try {
                const apiFB = yield this.adapterFB.getAPI(stepContext.context.activity);
                const content = facebookContent_1.callHotelMessage(psId, hotel);
                yield apiFB.callAPI('/me/messages', 'POST', content);
            }
            catch (err) {
                console.log(err);
            }
        });
    }
}
exports.MainDialog = MainDialog;
//# sourceMappingURL=mainDialog-bk.js.map