import {
  ComponentDialog,
  DialogSet,
  DialogState,
  DialogTurnResult,
  DialogTurnStatus,
  TextPrompt,
  WaterfallDialog,
  WaterfallStepContext,
  PromptOptions
} from 'botbuilder-dialogs';
import { FacebookAdapter } from 'botbuilder-adapter-facebook';
import { StartedDialog } from './startedDialog';
import { bookingCard } from './card';
import {
  InputHints,
  MessageFactory,
  StatePropertyAccessor,
  TurnContext
} from 'botbuilder';
import { getInfo } from '../apis/hermes';

const TEXT_PROMPT = 'TextPrompt';
const MAIN_WATERFALL_DIALOG = 'GET_STARTED';

export class MainDialog extends ComponentDialog {
  private adapterFB: FacebookAdapter;

  constructor(startedDialog: StartedDialog) {
    super('MainDialog');

    this.addDialog(new TextPrompt(TEXT_PROMPT))
        // .addDialog(startedDialog)
        .addDialog(new WaterfallDialog(MAIN_WATERFALL_DIALOG, [
          this.introStep.bind(this),
          this.finalStep.bind(this)
        ]));
    
    this.initialDialogId = MAIN_WATERFALL_DIALOG;

    this.adapterFB = new FacebookAdapter({
      verify_token: process.env.FACEBOOK_VERIFY_TOKEN,
      app_secret: process.env.FACEBOOK_APP_SECRET,
      access_token: process.env.FACEBOOK_ACCESS_TOKEN
    });
  }

  /**
   * The run method handles the incoming activity (in the form of a DialogContext) and passes it through the dialog system.
   * If no dialog is active, it will start the default dialog.
   */
  public async run(
    context: TurnContext,
    accessor: StatePropertyAccessor<DialogState>
  ) {
    const dialogSet = new DialogSet(accessor);
    dialogSet.add(this);

    const dialogContext = await dialogSet.createContext(context);
    const results = await dialogContext.continueDialog();

    if (results.status === DialogTurnStatus.empty) {
      await dialogContext.beginDialog(this.id);
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
  }

  private async introStep (stepContext: WaterfallStepContext) {
    const { text } = stepContext.context.activity;
    console.log(text);
    switch (text) {
      case 'BOOK_ROOMS':
        await stepContext.context.sendActivity('BOOK_ROOMS');
        break;
      case 'GET_STARTED': 
        await stepContext.context.sendActivity('GET_STARTED');
        break;
      case 'HOTEL_INFO':
        await stepContext.context.sendActivity('HOTEL_INFO');
        break;
      case 'CALL_HOTEL':
        await stepContext.context.sendActivity('CALL_HOTEL');
        break;
      default:
        break;
    }
    return await stepContext.next();
  }

  private async finalStep(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
    return await stepContext.endDialog(this.initialDialogId);
  }
}
