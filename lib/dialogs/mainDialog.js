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
            // if (
            //   context.activity.type === 'message' &&
            //   context.activity.text === 'BOOK_ROOMS'
            // ) {
            //   const name = context.activity.from.name;
            //   try {
            //     const api = await this.adapterFB.getAPI(context.activity);
            //     const psId = context.activity.from.id;
            //     // const fbPageId = context.activity.recipient.id;
            //     const fbPageId = 367359240646069;
            //     const res = await getInfo(fbPageId, psId);
            //     await api.callAPI('/me/messages', 'POST', {
            //       recipient: {
            //         id: psId
            //       },
            //       message: {
            //         attachment: {
            //           type: 'template',
            //           payload: {
            //             template_type: 'button',
            //             text: 'Try the URL button!',
            //             buttons: [
            //               {
            //                 type: 'web_url',
            //                 url: 'https://hermes-v2-staging.innaway.co/webview/booking-flexible?hotelId=chinh-staging&userId=3447555485284781&channel=Facebook',
            //                 title: 'URL Button',
            //                 webview_height_ratio: 'full',
            //                 messenger_extensions: true
            //               }
            //             ]
            //           }
            //         }
            //       }
            //     });
            //     // await context.sendActivity('ee e e');
            //   } catch (error) {
            //     console.log(error);
            //   }
            // }
        });
    }
    introStep(stepContext) {
        return __awaiter(this, void 0, void 0, function* () {
            const { text } = stepContext.context.activity;
            console.log(text);
            switch (text) {
                case 'BOOK_ROOMS':
                    yield stepContext.context.sendActivity('BOOK_ROOMS');
                    break;
                case 'GET_STARTED':
                    yield stepContext.context.sendActivity('GET_STARTED');
                    break;
                case 'HOTEL_INFO':
                    yield stepContext.context.sendActivity('HOTEL_INFO');
                    break;
                case 'CALL_HOTEL':
                    yield stepContext.context.sendActivity('CALL_HOTEL');
                    break;
                default:
                    break;
            }
            return yield stepContext.next();
        });
    }
    finalStep(stepContext) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield stepContext.endDialog(this.initialDialogId);
        });
    }
}
exports.MainDialog = MainDialog;
//# sourceMappingURL=mainDialog.js.map