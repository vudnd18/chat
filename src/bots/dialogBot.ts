import {
  ActivityHandler,
  BotState,
  ConversationState,
  StatePropertyAccessor,
  UserState,
  TurnContext
} from "botbuilder";
import { QnAMaker, LuisRecognizer } from "botbuilder-ai";
import { Dialog, DialogState } from "botbuilder-dialogs";
import { MainDialog } from "../dialogs/mainDialog";

export class DialogBot extends ActivityHandler {
  private conversationState: BotState;
  private userState: BotState;
  private dialog: Dialog;
  private dialogState: StatePropertyAccessor<DialogState>;

  constructor(
    conversationState: BotState,
    userState: BotState,
    dialog: Dialog
  ) {
    super();
    this.conversationState = conversationState;
    this.userState = userState;
    this.dialog = dialog;
    this.dialogState = this.conversationState.createProperty<DialogState>(
      "DialogState"
    );
    this.onMessage(async (context, next) => {
      console.log("Running dialog with Message Activity.");
      // Run the Dialog with the new message Activity.
      await (this.dialog as MainDialog).run(context, this.dialogState);
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
