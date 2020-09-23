import { ActivityHandler, BotState } from "botbuilder";
import { Dialog } from "botbuilder-dialogs";
export declare class DialogBot extends ActivityHandler {
    private conversationState;
    private userState;
    private dialog;
    private dialogState;
    constructor(conversationState: BotState, userState: BotState, dialog: Dialog);
}
