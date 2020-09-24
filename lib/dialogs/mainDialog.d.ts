import { ComponentDialog, DialogState } from 'botbuilder-dialogs';
import { StatePropertyAccessor, TurnContext } from 'botbuilder';
export declare class MainDialog extends ComponentDialog {
    private adapterFB;
    private hotel;
    constructor();
    /**
     * The run method handles the incoming activity (in the form of a DialogContext) and passes it through the dialog system.
     * If no dialog is active, it will start the default dialog.
     */
    run(context: TurnContext, accessor: StatePropertyAccessor<DialogState>): Promise<void>;
    private introStep;
    private finalStep;
    startBooking(context: any): Promise<void>;
    mainMenu(context: any): Promise<void>;
    hotelInfo(context: any): Promise<void>;
    callHotel(context: any): Promise<void>;
    detailFacility(context: any): Promise<void>;
}
