"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartedDialog = void 0;
const botbuilder_dialogs_1 = require("botbuilder-dialogs");
const TEXT_PROMPT = 'textPrompt';
class StartedDialog extends botbuilder_dialogs_1.ComponentDialog {
    constructor(id) {
        super(id);
        this.addDialog(new botbuilder_dialogs_1.TextPrompt(TEXT_PROMPT));
    }
}
exports.StartedDialog = StartedDialog;
//# sourceMappingURL=startedDialog.js.map