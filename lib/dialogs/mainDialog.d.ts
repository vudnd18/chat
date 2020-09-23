import { ComponentDialog, DialogState } from 'botbuilder-dialogs';
import { StartedDialog } from './startedDialog';
import { StatePropertyAccessor, TurnContext } from 'botbuilder';
export declare class MainDialog extends ComponentDialog {
    private adapterFB;
    constructor(startedDialog: StartedDialog);
    /**
     * The run method handles the incoming activity (in the form of a DialogContext) and passes it through the dialog system.
     * If no dialog is active, it will start the default dialog.
     */
    run(context: TurnContext, accessor: StatePropertyAccessor<DialogState>): Promise<void>;
    private introStep;
    private finalStep;
}
