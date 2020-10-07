"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageMiddleware = void 0;
class MessageMiddleware {
    onTurn(context, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log(context);
            // console.log("message_middleware", context.activity);
            // if (context.activity.value && context.activity.value.message && context.activity.value.message.attachments) {
            //   console.log(context.activity.value.message.attachments);
            // }
            yield next();
        });
    }
}
exports.MessageMiddleware = MessageMiddleware;
//# sourceMappingURL=messageMiddleware.js.map