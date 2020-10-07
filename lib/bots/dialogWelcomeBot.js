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
exports.DialogWelcomeBot = void 0;
const dialogBot_1 = require("./dialogBot");
const welcomeCardJson = require('../../resources/welcomeCard.json');
const USER_PROPERTY = 'USER_PROPERTY';
class DialogWelcomeBot extends dialogBot_1.DialogBot {
    constructor(conversationState, userState, dialog) {
        super(conversationState, userState, dialog);
        console.log('onMembersAdded');
        this.onMembersAdded((context, next) => __awaiter(this, void 0, void 0, function* () {
            const membersAdded = context.activity.membersAdded;
            for (const member of membersAdded) {
                if (member.id !== context.activity.recipient.id) {
                    yield dialog.run(context, conversationState.createProperty('DialogState'), userState.createProperty(USER_PROPERTY));
                }
            }
            // By calling next() you ensure that the next BotHandler is run.
            yield next();
        }));
    }
}
exports.DialogWelcomeBot = DialogWelcomeBot;
//# sourceMappingURL=dialogWelcomeBot.js.map