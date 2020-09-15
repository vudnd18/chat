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
class DialogBot {
    constructor(conversationState, userState, dialog, qnaMaker) {
        this.conversationState = conversationState;
        this.userState = userState;
        this.dialog = dialog;
        this.qnaMaker = qnaMaker;
        this.dialogState = this.conversationState.createProperty("DialogState");
    }
    onTurn(context, accessor) {
        return __awaiter(this, void 0, void 0, function* () {
            if (context.activity.type === "message") {
                const qnaResults = yield this.qnaMaker.generateAnswer(context.activity.text);
                if (qnaResults.length > 0) {
                    yield context.sendActivity(qnaResults[0].answer);
                }
            }
            else {
                yield context.sendActivity(`Xin chào mình là bot: Hãy nói "help" để mình giúp bạn`);
            }
        });
    }
}
exports.DialogBot = DialogBot;
//# sourceMappingURL=dialogBot.js.map