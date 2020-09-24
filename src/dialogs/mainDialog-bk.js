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
  TurnContext,
  CardFactory
} from 'botbuilder';
import { getInfo, getFacilitiesByHotelId } from '../apis/hermes';
import { generateWebviewBooking, menuWelcomeMessage, menuButtonMessage, callHotelMessage, hotelInfoMessage } from '../lib/facebookContent';
import { mainMenuInfo, webviewBooking } from '../lib/botContent';
const welcomeCardJson = require("../../resources/welcomeCard.json");
const TEXT_PROMPT = 'TextPrompt';
const MAIN_WATERFALL_DIALOG = 'GET_STARTED';

export class MainDialog extends ComponentDialog {
  private adapterFB: FacebookAdapter;
  private hotel: String;

  constructor(startedDialog: StartedDialog) {
    super('MainDialog');

    this.addDialog(new TextPrompt(TEXT_PROMPT))
      // .addDialog(startedDialog)
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
  }

  private async introStep(stepContext: WaterfallStepContext) {
    if (!this.hotel) {
      this.hotel = 'vudnd';
    }
    const { text } = stepContext.context.activity;
    console.log(text);
    switch (text) {
      case 'BOOK_ROOMS':
        await this.startBooking(stepContext);
        break;
      case 'GET_STARTED':
        await this.mainMenu(stepContext);
        break;
      case 'HOTEL_INFO':
        await this.hotelInfo(stepContext);
        break;
      case 'CALL_HOTEL':
        await this.callHotel(stepContext);
        break;
      default:
        break;
    }
    return await stepContext.next();
  }

  private async finalStep(
    stepContext: WaterfallStepContext
  ): Promise<DialogTurnResult> {
    // return await stepContext.replaceDialog(this.initialDialogId, { restartMsg: 'What else can I do for you?' });
    console.log(stepContext);
    return await stepContext.endDialog();
  }

  public async startBooking(stepContext: WaterfallStepContext) {
    const customerName = stepContext.context.activity.from.name;
    const psId = stepContext.context.activity.from.id;
    // const fbPageId = stepContext.context.activity.recipient.id;
    const fbPageId = 367359240646069;
    const res = await getInfo(fbPageId, psId);
    const { hotel, customer } = res.data.data;
    try {
      // const apiFB = await this.adapterFB.getAPI(stepContext.context.activity);
      // const queryFB = generateWebviewBooking(psId, hotel, customerName);
      // await apiFB.callAPI('/me/messages', 'POST', queryFB);
      const card = webviewBooking(psId, hotel, customerName);
      await stepContext.context.sendActivity({ attachments: [card] });
    } catch (err) {
      console.log(err);
    }
  }

  public async mainMenu(stepContext: WaterfallStepContext) {
    const customerName = stepContext.context.activity.from.name;
    const psId = stepContext.context.activity.from.id;
    // const fbPageId = stepContext.context.activity.recipient.id;
    const fbPageId = 367359240646069;
    const res = await getInfo(fbPageId, psId);
    const { hotel, customer } = res.data.data;
    const card = mainMenuInfo(hotel);
    // await stepContext.context.sendActivity({ attachments: [card] });
    try {
      const apiFB = await this.adapterFB.getAPI(stepContext.context.activity);
      const menuWelcome = menuWelcomeMessage(psId, hotel);
      const menuButton = menuButtonMessage(psId, hotel, customerName);
      await apiFB.callAPI('/me/messages', 'POST', menuWelcome);
      await apiFB.callAPI('/me/messages', 'POST', menuButton);
    } catch (err) {
      console.log(err);
    }
  }

  public async hotelInfo(stepContext: WaterfallStepContext) {
    const customerName = stepContext.context.activity.from.name;
    const psId = stepContext.context.activity.from.id;
    // const fbPageId = stepContext.context.activity.recipient.id;
    const fbPageId = 367359240646069;
    const res = await getInfo(fbPageId, psId);
    const { hotel, customer } = res.data.data;
    const resFacilities = await getFacilitiesByHotelId(fbPageId);
    const facilities = resFacilities.data.data;
    try {
      const content = hotelInfoMessage(psId, hotel, facilities);
      const apiFB = await this.adapterFB.getAPI(stepContext.context.activity);
      await apiFB.callAPI('/me/messages', 'POST', content);
    } catch (err) {
      console.log(err);
    }
  }

  public async callHotel(stepContext: WaterfallStepContext) {
    const customerName = stepContext.context.activity.from.name;
    const psId = stepContext.context.activity.from.id;
    // const fbPageId = stepContext.context.activity.recipient.id;
    const fbPageId = 367359240646069;
    const res = await getInfo(fbPageId, psId);
    const { hotel, customer } = res.data.data;
    try {
      const apiFB = await this.adapterFB.getAPI(stepContext.context.activity);
      const content = callHotelMessage(psId, hotel);
      await apiFB.callAPI('/me/messages', 'POST', content);
    } catch (err) {
      console.log(err);
    }
  }
}
