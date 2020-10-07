import { ActivityHandler, BotState } from "botbuilder";
import { Dialog } from "botbuilder-dialogs";
export declare class DialogBot extends ActivityHandler {
    private readonly conversationState;
    private readonly userState;
    private readonly dialog;
    private readonly dialogState;
    private readonly conversationDataAccessor;
    private readonly userAccessor;
    constructor(conversationState: BotState, userState: BotState, dialog: Dialog);
}
