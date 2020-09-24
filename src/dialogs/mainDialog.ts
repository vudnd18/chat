import {
  ComponentDialog,
  DialogSet,
  DialogState,
  DialogTurnResult,
  DialogTurnStatus,
  TextPrompt,
  WaterfallDialog,
  WaterfallStepContext,
  PromptOptions,
  ChoicePrompt
} from 'botbuilder-dialogs';
import { FacebookAdapter } from 'botbuilder-adapter-facebook';
import { bookingCard } from './card';
import {
  InputHints,
  MessageFactory,
  StatePropertyAccessor,
  TurnContext,
  CardFactory,
  ActionTypes,
  AttachmentLayoutTypes
} from 'botbuilder';
import { getInfo, getFacilitiesByHotelId } from '../apis/hermes';
import {
  generateWebviewBooking,
  menuWelcomeMessage,
  menuButtonMessage,
  callHotelMessage,
  hotelInfoMessage
} from '../lib/facebookContent';
import {
  webviewBookingContent,
  mainMenuContent,
  callHotelContent,
  hotelInfoContent
} from '../lib/botContent';
const welcomeCardJson = require('../../resources/welcomeCard.json');
const TEXT_PROMPT = 'TextPrompt';
const MAIN_WATERFALL_DIALOG = 'GET_STARTED';
const CHOICE_PROMPT = 'choicePrompt';

export class MainDialog extends ComponentDialog {
  private adapterFB: FacebookAdapter;
  private hotel: String;

  constructor() {
    super('MainDialog');

    this.addDialog(new TextPrompt(TEXT_PROMPT))
      .addDialog(new ChoicePrompt(CHOICE_PROMPT))
      .addDialog(
        new WaterfallDialog(MAIN_WATERFALL_DIALOG, [
          this.introStep.bind(this),
          this.finalStep.bind(this)
        ])
      );

    this.initialDialogId = MAIN_WATERFALL_DIALOG;

    this.adapterFB = new FacebookAdapter({
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
    const { text } = context.activity;
    switch (text) {
      case 'BOOK_ROOMS':
        await this.startBooking(context);
        break;
      case 'GET_STARTED':
        await this.mainMenu(context);
      case 'HOTEL_INFO':
        await this.hotelInfo(context);
        break;
      case 'CALL_HOTEL':
        await this.callHotel(context);
        break;
      default:
        break;
    }
    if (text.startsWith('SHOW_FACILITY')) {
      await this.detailFacility(context);
    }
  }

  private async introStep(stepContext: WaterfallStepContext) {
    const { text } = stepContext.context.activity;
    console.log('introStep');
    // return await stepContext.prompt(TEXT_PROMPT, { prompt: 'hello' });
    // switch (text) {
    //   case 'BOOK_ROOMS':
    //     await this.startBooking(stepContext);
    //     break;
    //   case 'GET_STARTED':
    //     await this.mainMenu(stepContext);
    //     break;
    //   case 'HOTEL_INFO':
    //     await this.hotelInfo(stepContext);
    //     break;
    //   case 'CALL_HOTEL':
    //     await this.callHotel(stepContext);
    //     break;
    //   default:
    //     break;
    // }
    // const choices = ["Book rooms", "Main menu", "Hotel Info"];
    // const options: PromptOptions = {
    //   prompt: "Bạn muốn biết về điều gì ?",
    //   choices: choices
    // };
    // return await stepContext.prompt(CHOICE_PROMPT, options);
    return await stepContext.next();
  }

  private async finalStep(
    stepContext: WaterfallStepContext
  ): Promise<DialogTurnResult> {
    // return await stepContext.replaceDialog(this.initialDialogId, { restartMsg: 'What else can I do for you?' });
    console.log('finalStep');
    return await stepContext.endDialog();
  }

  public async startBooking(context) {
    // const fbPageId = context.activity.recipient.id;
    const fbPageId = 367359240646069;
    const customerName = context.activity.from.name;
    const psId = context.activity.from.id;
    const res = await getInfo(fbPageId, psId);
    const { hotel, customer } = res.data.data;
    try {
      const card = webviewBookingContent(psId, hotel, customerName);
      await context.sendActivity({ attachments: [card] });
    } catch (err) {
      console.log(err);
    }
  }

  public async mainMenu(context) {
    // const fbPageId = context.activity.recipient.id;
    const fbPageId = 367359240646069;
    const customerName = context.activity.from.name;
    const psId = context.activity.from.id;
    const res = await getInfo(fbPageId, psId);
    const { hotel, customer } = res.data.data;
    try {
      const card = mainMenuContent(psId, hotel, customerName);
      await context.sendActivity({ attachments: [card] });
    } catch (err) {
      console.log(err);
    }
  }

  public async hotelInfo(context) {
    // const fbPageId = stepContext.context.activity.recipient.id;
    const fbPageId = 367359240646069;
    const customerName = context.activity.from.name;
    const psId = context.activity.from.id;
    const res = await getInfo(fbPageId, psId);
    const { hotel, customer } = res.data.data;
    const resFacilities = await getFacilitiesByHotelId(fbPageId);
    const facilities = resFacilities.data.data;
    try {
      const content = hotelInfoContent(psId, hotel, facilities);
      console.log(content);
      await context.sendActivity({
        attachmentLayout: AttachmentLayoutTypes.Carousel,
        attachments: content
      });
    } catch (err) {
      console.log(err);
    }
  }

  public async callHotel(context) {
    // const fbPageId = stepContext.context.activity.recipient.id;
    const fbPageId = 367359240646069;
    const customerName = context.activity.from.name;
    const psId = context.activity.from.id;
    const res = await getInfo(fbPageId, psId);
    const { hotel, customer } = res.data.data;
    try {
      const card = callHotelContent(psId, hotel, customerName);
      const welcomeCard = CardFactory.adaptiveCard(card);
      await context.sendActivity({ attachments: [welcomeCard] });
    } catch (err) {
      console.log(err);
    }
  }

  public async detailFacility(context) {
    const fbPageId = 367359240646069;
    const customerName = context.activity.from.name;
    const psId = context.activity.from.id;
    const res = await getFacilitiesByHotelId(fbPageId);
    const facilities = res.data.data;
    const { text } = context.activity;
    const id = text.split('-')[1];
    const facility = facilities.find(item => item.id == id);
    await context.sendActivity(facility.long_description);
  }
}
