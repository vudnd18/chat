import { BotState } from 'botbuilder';
import { DialogBot } from './dialogBot';
import { Dialog } from 'botbuilder-dialogs';
export declare class DialogWelcomeBot extends DialogBot {
    constructor(conversationState: BotState, userState: BotState, dialog: Dialog);
}
