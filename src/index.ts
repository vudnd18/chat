import { config } from 'dotenv';
import * as path from 'path';
import * as restify from 'restify';
import {
  BotFrameworkAdapter,
  ConversationState,
  MemoryStorage,
  UserState
} from 'botbuilder';
import { DialogSet } from 'botbuilder-dialogs';
import { QnAMaker, LuisRecognizer } from 'botbuilder-ai';
import { BlobStorage } from 'botbuilder-azure';
import { FacebookAdapter } from 'botbuilder-adapter-facebook';

const ENV_FILE = path.join(__dirname, '..', '.env');
config({ path: ENV_FILE });

import { DialogWelcomeBot } from './bots/dialogWelcomeBot';
import { MainDialog } from './dialogs/mainDialog';
import { MessageMiddleware } from './middleware/messageMiddleware';

const adapter = new BotFrameworkAdapter({
  appId: process.env.MICROSOFT_APP_ID,
  appPassword: process.env.MIRCROSOFT_APP_PASSWORD
});

adapter.use(new MessageMiddleware());

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

const blobStorage = new BlobStorage({
  containerName: process.env.BLOB_CONTAINER,
  storageAccountOrConnectionString: process.env.BLOB_STORAGE,
  storageAccessKey: process.env.BLOB_KEY
});

let conversationState: ConversationState;
let userState: UserState;

// For local development, in-memory storage is used.
const memoryStorage = new MemoryStorage();
conversationState = new ConversationState(blobStorage);
userState = new UserState(blobStorage);

// Create the main dialog.
const dialog = new MainDialog();
const bot: DialogWelcomeBot = new DialogWelcomeBot(
  conversationState,
  userState,
  dialog
);

// Catch-all for errors.
const onTurnErrorHandler = async (context, error) => {
  // This check writes out errors to console log .vs. app insights.
  // NOTE: In production environment, you should consider logging this to Azure
  //       application insights.
  console.error(`\n [onTurnError] unhandled error: ${ error }`);
  // Send a trace activity, which will be displayed in Bot Framework Emulator
  await context.sendTraceActivity(
      'OnTurnError Trace',
      `${ error }`,
      'https://www.botframework.com/schemas/error',
      'TurnError'
  );
  // Send a message to the user
  await context.sendActivity('The bot encountered an error or bug.');
  await context.sendActivity('To continue to run this bot, please fix the bot source code.');
  // Clear out state
  await conversationState.delete(context);
};

// Default bot 
server.post('/api/messages', (req, res) => {
  adapter.processActivity(req, res, async (context) => {
    await bot.run(context);
  });
});


