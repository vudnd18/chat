import { BotState, StatePropertyAccessor, TurnContext } from "botbuilder";
import { QnAMaker } from "botbuilder-ai";
import { Dialog, DialogState } from "botbuilder-dialogs";
export declare class DialogBot {
    private conversationState;
    private userState;
    private dialog;
    private dialogState;
    private qnaMaker;
    constructor(conversationState: BotState, userState: BotState, dialog: Dialog, qnaMaker: QnAMaker);
    onTurn(context: TurnContext, accessor: StatePropertyAccessor<DialogState>): Promise<void>;
}
