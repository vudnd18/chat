import { TurnContext } from 'botbuilder';
import { Middleware } from 'botbuilder-core';
export declare class MessageMiddleware implements Middleware {
    onTurn(context: TurnContext, next: () => Promise<void>): Promise<void>;
}
