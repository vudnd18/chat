import {
  ConfirmPrompt,
  DialogTurnResult,
  TextPrompt,
  WaterfallDialog,
  WaterfallStepContext,
  ComponentDialog,
  DialogContext,
  DialogTurnStatus,
  DialogState
} from 'botbuilder-dialogs';
import { StatePropertyAccessor, TurnContext } from 'botbuilder';

const TEXT_PROMPT = 'textPrompt';

export class StartedDialog extends ComponentDialog {
  constructor(id: string) {
    super(id);
    this.addDialog(new TextPrompt(TEXT_PROMPT));
  }
}
