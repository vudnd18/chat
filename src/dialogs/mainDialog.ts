import {
  ComponentDialog,
  DialogSet,
  DialogState,
  DialogTurnResult,
  DialogTurnStatus,
  TextPrompt,
  WaterfallDialog,
  WaterfallStepContext,
  ChoicePrompt,
} from "botbuilder-dialogs";
import { FacebookAdapter } from "botbuilder-adapter-facebook";
import {
  StatePropertyAccessor,
  TurnContext,
  CardFactory,
  AttachmentLayoutTypes,
} from "botbuilder";
import { getFacilities, getHotel } from "../apis/hermes";
import {
  webviewBookingContent,
  mainMenuContent,
  callHotelContent,
  hotelInfoContent,
} from "../lib/botContent";
import { capitalizeFirstLetter } from "../lib/helper";
const welcomeCardJson = require("../../resources/welcomeCard.json");
const TEXT_PROMPT = "TextPrompt";
const MAIN_WATERFALL_DIALOG = "GET_STARTED";
const CHOICE_PROMPT = "choicePrompt";

export class MainDialog extends ComponentDialog {
  private readonly adapterFB: FacebookAdapter;
  private readonly hotel: String;

  constructor() {
    super("MainDialog");

    this.addDialog(new TextPrompt(TEXT_PROMPT))
      .addDialog(new ChoicePrompt(CHOICE_PROMPT))
      .addDialog(
        new WaterfallDialog(MAIN_WATERFALL_DIALOG, [
          this.introStep.bind(this),
          this.finalStep.bind(this),
        ]),
      );

    this.initialDialogId = MAIN_WATERFALL_DIALOG;

    this.adapterFB = new FacebookAdapter({
      verify_token: process.env.FACEBOOK_VERIFY_TOKEN,
      app_secret: process.env.FACEBOOK_APP_SECRET,
      access_token: process.env.FACEBOOK_ACCESS_TOKEN,
    });
    this.hotel = "";
  }

  /**
   * The run method handles the incoming activity (in the form of a DialogContext) and passes it through the dialog system.
   * If no dialog is active, it will start the default dialog.
   */
  public async run(
    context: TurnContext,
    accessor: StatePropertyAccessor<DialogState>,
    userAccessor: StatePropertyAccessor,
  ) {
    const dialogSet = new DialogSet(accessor);
    dialogSet.add(this);

    const dialogContext = await dialogSet.createContext(context);
    const results = await dialogContext.continueDialog();
    if (results.status === DialogTurnStatus.empty) {
      await dialogContext.beginDialog(this.id);
    }
    const { text } = context.activity;
    const userProfile = await userAccessor.get(context, {});
    console.log(text);
    switch (text) {
      case "BOOK_ROOMS":
        await this.startBooking(context, userProfile);
        break;
      case "GET_STARTED":
        await this.mainMenu(context, userProfile);
        break;
      case "HOTEL_INFO":
        await this.hotelInfo(context, userProfile);
        break;
      case "CALL_HOTEL":
        await this.callHotel(context, userProfile);
        break;
      default:
        break;
    }
    if (text && text.startsWith("SHOW_FACILITY")) {
      await this.detailFacility(context, userProfile);
    }
  }

  public async startBooking(context, userProfile) {
    // let pageId = context.activity.recipient.id;
    const customerName = context.activity.from.name;
    const psId = context.activity.from.id;
    const channel = "facebook";
    try {
      const { hotel } = userProfile;
      const card = webviewBookingContent(psId, hotel, channel, customerName);
      await context.sendActivity({ attachments: [card] });
    } catch (err) {
      // console.log(err);
    }
  }

  public async mainMenu(context, userProfile) {
    const psId = context.activity.from.id;
    const customerName = context.activity.from.name;
    const { hotel } = userProfile;
    try {
      const card = mainMenuContent(psId, hotel, customerName);
      const reply = await context.sendActivity({ attachments: [card] });
      // var reference = TurnContext.getReplyConversationReference(
      //   context.activity,
      //   reply
      // );
      // console.log('reference', reference);
      // getConversationReference
    } catch (err) {
      console.log(err);
    }
  }

  public async hotelInfo(context, userProfile) {
    // let pageId = stepContext.context.activity.recipient.id;
    let pageId = 367359240646069;
    const customerName = context.activity.from.name;
    const psId = context.activity.from.id;
    let channel = context.activity.channelId;
    channel = capitalizeFirstLetter(channel);
    if (channel === "Line") {
      pageId = 1654145898;
    }
    const res = await getHotel(pageId, channel);
    const hotel = res.data.data;
    const resFacilities = await getFacilities(pageId, channel);
    const facilities = resFacilities.data.data;
    try {
      const content = hotelInfoContent(psId, hotel, facilities);
      await context.sendActivity({
        attachmentLayout: AttachmentLayoutTypes.Carousel,
        attachments: content,
      });
    } catch (err) {
      console.log(err);
    }
  }

  public async callHotel(context, userProfile) {
    // let pageId = stepContext.context.activity.recipient.id;
    let pageId = 367359240646069;
    const customerName = context.activity.from.name;
    const psId = context.activity.from.id;
    let channel = context.activity.channelId;
    channel = capitalizeFirstLetter(channel);
    if (channel === "Line") {
      pageId = 1654145898;
    }
    const res = await getHotel(pageId, channel);
    const hotel = res.data.data;
    try {
      const card = callHotelContent(psId, hotel, customerName);
      const welcomeCard = CardFactory.adaptiveCard(card);
      await context.sendActivity({ attachments: [welcomeCard] });
    } catch (err) {
      console.log(err);
    }
  }

  public async detailFacility(context, userProfile) {
    let pageId = 367359240646069;
    const customerName = context.activity.from.name;
    const psId = context.activity.from.id;
    let channel = context.activity.channelId;
    channel = capitalizeFirstLetter(channel);
    if (channel === "Line") {
      pageId = 1654145898;
    }
    const res = await getFacilities(pageId, channel);
    const facilities = res.data.data;
    const { text } = context.activity;
    const id = text.split("-")[1];
    const facility = facilities.find((item) => item.id === id);
    await context.sendActivity(facility.long_description);
  }

  private async introStep(stepContext: WaterfallStepContext) {
    const { text } = stepContext.context.activity;
    // const choices = ["Book rooms", "Main menu", "Hotel Info"];
    // const options: PromptOptions = {
    //   prompt: "Bạn muốn biết về điều gì ?",
    //   choices: choices
    // };
    // return await stepContext.prompt(CHOICE_PROMPT, options);
    return await stepContext.next();
  }

  private async finalStep(
    stepContext: WaterfallStepContext,
  ): Promise<DialogTurnResult> {
    return await stepContext.endDialog();
  }
}
