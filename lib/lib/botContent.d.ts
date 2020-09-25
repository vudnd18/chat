import { Attachment } from 'botbuilder';
export declare function webviewBookingContent(psId: any, hotel: any, channel: any, customerName: any): Attachment;
export declare function mainMenuContent(psId: any, hotel: any, customerName: any): Attachment;
export declare function hotelInfoContent(psId: any, hotel: any, facilities: any): Attachment[];
export declare function callHotelContent(psId: any, hotel: any, customerName: any): {
    type: string;
    version: string;
    body: {
        type: string;
        spacing: string;
        size: string;
        weight: string;
        text: string;
        wrap: boolean;
        maxLines: number;
    }[];
    actions: {
        type: string;
        title: string;
        url: string;
    }[];
};
