import { TurnContext, ConversationState } from "botbuilder";
import { QnAMaker, LuisRecognizer } from "botbuilder-ai";
import { bookingCard, mainMenuCardButton } from "../dialogs/card";
import {
  DialogSet,
  WaterfallDialog,
  ChoicePrompt,
  WaterfallStepContext,
  PromptOptions,
  DialogContext,
  DialogTurnResult
} from "botbuilder-dialogs";

export class ConfBot {
  private qnaMaker: QnAMaker;
  private luis: LuisRecognizer;
  private dialogs: DialogSet;
  private conversationState: ConversationState;

  constructor(
    qnaMaker: QnAMaker,
    luis: LuisRecognizer,
    dialogs: DialogSet,
    conversationState: ConversationState
  ) {
    this.qnaMaker = qnaMaker;
    this.luis = luis;
    this.dialogs = dialogs;
    this.conversationState = conversationState;
    this.addDialogs();
  }

  public async onTurn(context: TurnContext) {
    const dc = await this.dialogs.createContext(context);
    await dc.continueDialog();
    if (context.activity.text !== null && context.activity.text === "help") {
      await dc.beginDialog("help");
    }
    if (context.activity.type === "message") {
      const qnaResults = await this.qnaMaker.generateAnswer(
        context.activity.text
      );
      if (qnaResults.length > 0) {
        await context.sendActivity(qnaResults[0].answer);
      } else {
      }
    } else {
      await context.sendActivity(
        `Xin chào mình là bot: Hãy nói "help" để mình giúp bạn`
      );
    }
    await this.conversationState.saveChanges(context);
  }

  private addDialogs(): void {
    this.dialogs.add(
      new WaterfallDialog("help", [
        async (step: WaterfallStepContext): Promise<DialogTurnResult> => {
          const choices = ["Book rooms", "Main menu", "Hotel Info"];
          const options: PromptOptions = {
            prompt: "Bạn muốn biết về điều gì ?",
            choices: choices
          };
          return step.prompt("choicePrompt", options);
        },
        async (step: WaterfallStepContext): Promise<DialogTurnResult> => {
          switch (step.result.index) {
            case 0:
              const card = bookingCard();
              await step.context.sendActivity({
                attachments: [card]
              });
              break;
            case 1:
              const cardStarted = mainMenuCardButton();
              await step.context.sendActivity({
                attachments: [cardStarted]
              });
              break;
            case 2:
              await step.context.sendActivity(`You can ask:
                * _Where is Micheal talking ?_
                * _Where is the bot talk ?_
                * _What time is the bot talk ?_
              `);
              break;
            default:
              break;
          }
          return step.endDialog();
        }
      ])
    );
    this.dialogs.add(new ChoicePrompt("choicePrompt"));
  }
}
