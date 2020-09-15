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

export class DialogBot {
  private conversationState: BotState;
  private userState: BotState;
  private dialog: Dialog;
  private dialogState: StatePropertyAccessor<DialogState>;
  private qnaMaker: QnAMaker;

  constructor(
    conversationState: BotState,
    userState: BotState,
    dialog: Dialog,
    qnaMaker: QnAMaker
  ) {
    this.conversationState = conversationState;
    this.userState = userState;
    this.dialog = dialog;
    this.qnaMaker = qnaMaker;
    this.dialogState = this.conversationState.createProperty<DialogState>(
      "DialogState"
    );
  }

  public async onTurn(
    context: TurnContext,
    accessor: StatePropertyAccessor<DialogState>
  ): Promise<void> {
    if (context.activity.type === "message") {
      const qnaResults = await this.qnaMaker.generateAnswer(
        context.activity.text
      );
      if (qnaResults.length > 0) {
        await context.sendActivity(qnaResults[0].answer);
      }
    } else {
      await context.sendActivity(
        `Xin chào mình là bot: Hãy nói "help" để mình giúp bạn`
      );
    }
  }
}
