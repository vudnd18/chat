import { TurnContext } from 'botbuilder';
import { Middleware } from 'botbuilder-core';

export class MessageMiddleware implements Middleware {
  public async onTurn(context: TurnContext, next: () => Promise<void>): Promise<void> {
    // console.log(context);
    // console.log("message_middleware", context.activity);
    // if (context.activity.value && context.activity.value.message && context.activity.value.message.attachments) {
    //   console.log(context.activity.value.message.attachments);
    // }
    await next();
  }
}