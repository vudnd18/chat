"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const path = __importStar(require("path"));
const restify = __importStar(require("restify"));
const botbuilder_1 = require("botbuilder");
const botbuilder_azure_1 = require("botbuilder-azure");
const ENV_FILE = path.join(__dirname, '..', '.env');
dotenv_1.config({ path: ENV_FILE });
const dialogWelcomeBot_1 = require("./bots/dialogWelcomeBot");
const mainDialog_1 = require("./dialogs/mainDialog");
const messageMiddleware_1 = require("./middleware/messageMiddleware");
const adapter = new botbuilder_1.BotFrameworkAdapter({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MIRCROSOFT_APP_PASSWORD
});
adapter.use(new messageMiddleware_1.MessageMiddleware());
// const adapterFB = new FacebookAdapter({
//   verify_token: process.env.FACEBOOK_VERIFY_TOKEN,
//   app_secret: process.env.FACEBOOK_APP_SECRET,
//   access_token: process.env.FACEBOOK_ACCESS_TOKEN
// });
const server = restify.createServer();
server.use(restify.plugins.bodyParser());
server.use(restify.plugins.queryParser());
server.listen(process.env.port || process.env.PORT || 3978, () => {
    console.log(`${server.name} listening on ${server.url}`);
});
// const qnaMaker = new QnAMaker({
//   knowledgeBaseId: process.env.QNA_ID,
//   endpointKey: process.env.QNA_KEY,
//   host: process.env.QNA_HOST
// });
// const luis = new LuisRecognizer({
//   applicationId: process.env.LUIS_ID,
//   endpointKey: process.env.LUIS_KEY,
//   endpoint: process.env.LUIS_ENDPOINT
// });
const blobStorage = new botbuilder_azure_1.BlobStorage({
    containerName: process.env.BLOB_CONTAINER,
    storageAccountOrConnectionString: process.env.BLOB_STORAGE,
    storageAccessKey: process.env.BLOB_KEY
});
let conversationState;
let userState;
// For local development, in-memory storage is used.
const memoryStorage = new botbuilder_1.MemoryStorage();
conversationState = new botbuilder_1.ConversationState(blobStorage);
userState = new botbuilder_1.UserState(blobStorage);
// Create the main dialog.
const dialog = new mainDialog_1.MainDialog();
const bot = new dialogWelcomeBot_1.DialogWelcomeBot(conversationState, userState, dialog);
// Catch-all for errors.
const onTurnErrorHandler = (context, error) => __awaiter(void 0, void 0, void 0, function* () {
    // This check writes out errors to console log .vs. app insights.
    // NOTE: In production environment, you should consider logging this to Azure
    //       application insights.
    console.error(`\n [onTurnError] unhandled error: ${error}`);
    // Send a trace activity, which will be displayed in Bot Framework Emulator
    yield context.sendTraceActivity('OnTurnError Trace', `${error}`, 'https://www.botframework.com/schemas/error', 'TurnError');
    // Send a message to the user
    yield context.sendActivity('The bot encountered an error or bug.');
    yield context.sendActivity('To continue to run this bot, please fix the bot source code.');
    // Clear out state
    yield conversationState.delete(context);
});
// Default bot 
server.post('/api/messages', (req, res) => {
    adapter.processActivity(req, res, (context) => __awaiter(void 0, void 0, void 0, function* () {
        yield bot.run(context);
    }));
});
//# sourceMappingURL=index.js.map