import { BotState, CardFactory } from 'botbuilder';
import { DialogBot } from './dialogBot';
import { MainDialog } from '../dialogs/mainDialog';
import { Dialog, DialogState } from 'botbuilder-dialogs';

const welcomeCardJson = require('../../resources/welcomeCard.json');
const USER_PROPERTY = 'USER_PROPERTY';
export class DialogWelcomeBot extends DialogBot {
  constructor(
    conversationState: BotState,
    userState: BotState,
    dialog: Dialog
  ) {
    super(conversationState, userState, dialog);
    console.log('onMembersAdded');
    this.onMembersAdded(async (context, next) => {
      const membersAdded = context.activity.membersAdded;
      for (const member of membersAdded) {
        if (member.id !== context.activity.recipient.id) {
          await (dialog as MainDialog).run(
            context,
            conversationState.createProperty<DialogState>('DialogState'),
            userState.createProperty(USER_PROPERTY)
          );
        }
      }
      // By calling next() you ensure that the next BotHandler is run.
      await next();
    });
  }
}
