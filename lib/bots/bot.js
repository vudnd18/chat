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
exports.ConfBot = void 0;
const card_1 = require("../dialogs/card");
const botbuilder_dialogs_1 = require("botbuilder-dialogs");
class ConfBot {
    constructor(qnaMaker, luis, dialogs, conversationState) {
        this.qnaMaker = qnaMaker;
        this.luis = luis;
        this.dialogs = dialogs;
        this.conversationState = conversationState;
        this.addDialogs();
    }
    onTurn(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const dc = yield this.dialogs.createContext(context);
            yield dc.continueDialog();
            if (context.activity.text !== null && context.activity.text === "help") {
                yield dc.beginDialog("help");
            }
            if (context.activity.type === "message") {
                const qnaResults = yield this.qnaMaker.generateAnswer(context.activity.text);
                if (qnaResults.length > 0) {
                    yield context.sendActivity(qnaResults[0].answer);
                }
                else {
                }
            }
            else {
                yield context.sendActivity(`Xin chào mình là bot: Hãy nói "help" để mình giúp bạn`);
            }
            yield this.conversationState.saveChanges(context);
        });
    }
    addDialogs() {
        this.dialogs.add(new botbuilder_dialogs_1.WaterfallDialog("help", [
            (step) => __awaiter(this, void 0, void 0, function* () {
                const choices = ["Book rooms", "Main menu", "Hotel Info"];
                const options = {
                    prompt: "Bạn muốn biết về điều gì ?",
                    choices: choices
                };
                return step.prompt("choicePrompt", options);
            }),
            (step) => __awaiter(this, void 0, void 0, function* () {
                switch (step.result.index) {
                    case 0:
                        const card = card_1.bookingCard();
                        yield step.context.sendActivity({
                            attachments: [card]
                        });
                        break;
                    case 1:
                        const cardStarted = card_1.mainMenuCardButton();
                        yield step.context.sendActivity({
                            attachments: [cardStarted]
                        });
                        break;
                    case 2:
                        yield step.context.sendActivity(`You can ask:
                * _Where is Micheal talking ?_
                * _Where is the bot talk ?_
                * _What time is the bot talk ?_
              `);
                        break;
                    default:
                        break;
                }
                return step.endDialog();
            })
        ]));
        this.dialogs.add(new botbuilder_dialogs_1.ChoicePrompt("choicePrompt"));
    }
}
exports.ConfBot = ConfBot;
//# sourceMappingURL=bot.js.map