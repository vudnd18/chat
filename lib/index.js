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
const dotenv_1 = require("dotenv");
const path = require("path");
const restify = require("restify");
const botbuilder_1 = require("botbuilder");
const botbuilder_dialogs_1 = require("botbuilder-dialogs");
const botbuilder_ai_1 = require("botbuilder-ai");
const ENV_FILE = path.join(__dirname, "..", ".env");
dotenv_1.config({ path: ENV_FILE });
const bot_1 = require("./bots/bot");
const adapter = new botbuilder_1.BotFrameworkAdapter({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MIRCROSOFT_APP_PASSWORD
});
const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, () => {
    console.log(`${server.name} listening on ${server.url}`);
});
const qnaMaker = new botbuilder_ai_1.QnAMaker({
    knowledgeBaseId: process.env.QNA_ID,
    endpointKey: process.env.QNA_KEY,
    host: process.env.QNA_HOST
});
const luis = new botbuilder_ai_1.LuisRecognizer({
    applicationId: process.env.LUIS_ID,
    endpointKey: process.env.LUIS_KEY,
    endpoint: process.env.LUIS_ENDPOINT
});
let conversationState;
let userState;
const memoryStorage = new botbuilder_1.MemoryStorage();
conversationState = new botbuilder_1.ConversationState(memoryStorage);
userState = new botbuilder_1.UserState(memoryStorage);
const dialogs = new botbuilder_dialogs_1.DialogSet(conversationState.createProperty("DialogState"));
// const bot: DialogBot = new DialogBot(conversationState, userState, dialog);
const bot = new bot_1.ConfBot(qnaMaker, luis, dialogs, conversationState);
server.post("/api/messages", (req, res) => {
    adapter.processActivity(req, res, (turnContext) => __awaiter(void 0, void 0, void 0, function* () {
        yield bot.onTurn(turnContext);
    }));
});
//# sourceMappingURL=index.js.map