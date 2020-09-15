import { config } from "dotenv";
import * as path from "path";
import * as restify from "restify";
import {
  BotFrameworkAdapter,
  ConversationState,
  MemoryStorage,
  UserState
} from "botbuilder";
import { DialogSet } from "botbuilder-dialogs";
import { QnAMaker, LuisRecognizer } from "botbuilder-ai";
const ENV_FILE = path.join(__dirname, "..", ".env");
config({ path: ENV_FILE });
import { DialogBot } from "./bots/dialogBot";
import { ConfBot } from "./bots/bot";

const adapter = new BotFrameworkAdapter({
  appId: process.env.MICROSOFT_APP_ID,
  appPassword: process.env.MIRCROSOFT_APP_PASSWORD
});

const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, () => {
  console.log(`${server.name} listening on ${server.url}`);
});

const qnaMaker = new QnAMaker({
  knowledgeBaseId: process.env.QNA_ID,
  endpointKey: process.env.QNA_KEY,
  host: process.env.QNA_HOST
});

const luis = new LuisRecognizer({
  applicationId: process.env.LUIS_ID,
  endpointKey: process.env.LUIS_KEY,
  endpoint: process.env.LUIS_ENDPOINT
});

let conversationState: ConversationState;
let userState: UserState;
const memoryStorage = new MemoryStorage();
conversationState = new ConversationState(memoryStorage);
userState = new UserState(memoryStorage);
const dialogs = new DialogSet(conversationState.createProperty("DialogState"));

// const bot: DialogBot = new DialogBot(conversationState, userState, dialog);
const bot: ConfBot = new ConfBot(qnaMaker, luis, dialogs, conversationState);

server.post("/api/messages", (req, res) => {
  adapter.processActivity(req, res, async (turnContext) => {
    await bot.onTurn(turnContext);
  });
});
