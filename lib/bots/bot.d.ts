import { TurnContext, ConversationState } from "botbuilder";
import { QnAMaker, LuisRecognizer } from "botbuilder-ai";
import { DialogSet } from "botbuilder-dialogs";
export declare class ConfBot {
    private qnaMaker;
    private luis;
    private dialogs;
    private conversationState;
    constructor(qnaMaker: QnAMaker, luis: LuisRecognizer, dialogs: DialogSet, conversationState: ConversationState);
    onTurn(context: TurnContext): Promise<void>;
    private addDialogs;
}
