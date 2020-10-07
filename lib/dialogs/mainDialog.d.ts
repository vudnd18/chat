import { ComponentDialog, DialogState } from "botbuilder-dialogs";
import { StatePropertyAccessor, TurnContext } from "botbuilder";
export declare class MainDialog extends ComponentDialog {
    private readonly adapterFB;
    private readonly hotel;
    constructor();
    /**
     * The run method handles the incoming activity (in the form of a DialogContext) and passes it through the dialog system.
     * If no dialog is active, it will start the default dialog.
     */
    run(context: TurnContext, accessor: StatePropertyAccessor<DialogState>, userAccessor: StatePropertyAccessor): Promise<void>;
    startBooking(context: any, userProfile: any): Promise<void>;
    mainMenu(context: any, userProfile: any): Promise<void>;
    hotelInfo(context: any, userProfile: any): Promise<void>;
    callHotel(context: any, userProfile: any): Promise<void>;
    detailFacility(context: any, userProfile: any): Promise<void>;
    private introStep;
    private finalStep;
}
