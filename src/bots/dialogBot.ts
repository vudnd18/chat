import {
  ActivityHandler,
  BotState,
  StatePropertyAccessor,
} from "botbuilder";
import { Dialog, DialogState } from "botbuilder-dialogs";
import { MainDialog } from "../dialogs/mainDialog";
import { getFacilities, getHotel } from "../apis/hermes";
import { capitalizeFirstLetter } from "../lib/helper";

const CONVERSATION_DATA_PROPERTY = "CONVERSATION_DATA_PROPERTY";
const USER_PROPERTY = "USER_PROPERTY";

export class DialogBot extends ActivityHandler {
  private readonly conversationState: BotState;
  private readonly userState: BotState;
  private readonly dialog: Dialog;
  private readonly dialogState: StatePropertyAccessor<DialogState>;
  private readonly conversationDataAccessor: StatePropertyAccessor<DialogState>;
  private readonly userAccessor: StatePropertyAccessor;

  constructor(
    conversationState: BotState,
    userState: BotState,
    dialog: Dialog,
  ) {
    super();
    this.conversationState = conversationState;
    this.userState = userState;
    this.dialog = dialog;
    this.dialogState = this.conversationState.createProperty<DialogState>(
      "DialogState",
    );
    this.conversationDataAccessor = conversationState.createProperty(CONVERSATION_DATA_PROPERTY);
    this.userAccessor = userState.createProperty(USER_PROPERTY);

    this.onMessage(async (context, next) => {
      console.log("Running dialog with Message Activity.");
      const userProfile = await this.userAccessor.get(context, {});
      let pageId = 367359240646069;
      let channel = context.activity.channelId;
      channel = capitalizeFirstLetter(channel);
      if (channel == "Line") {
        pageId = 1654145898;
      }
      if (!userProfile.hotel) {
        try {
          const res = await getHotel(pageId, channel);
          const hotelInfo = res.data.data;
          userProfile.hotel = hotelInfo;
        } catch (error) {
          const { response } = error;
          const { statusText } = response;
          console.log("Get Hotel", statusText);
        }
      }
      if (!userProfile.facilites) {
        try {
          const res = await getFacilities(pageId, channel);
          const facilites = res.data.data;
          userProfile.facilites = facilites;
        } catch (error) {
          const { response } = error;
          const { statusText } = response;
          console.log("Get Facilities", statusText);
        }
      }
      if (!userProfile.name) {
        userProfile.name =  context.activity.from.name;
      }

      // Run the Dialog with the new message Activity.
      await (this.dialog as MainDialog).run(context, this.dialogState, this.userAccessor);
      // By calling next() you ensure that the next BotHandler is run.
      await next();
    });

    this.onDialog(async (context, next) => {
      // Save any state changes. The load happened during the exceution of Dialog.
      await this.conversationState.saveChanges(context, false);
      await this.userState.saveChanges(context, false);
      // By calling next() you ensure that the next BotHandler is run.
      await next();
    });
  }

}
