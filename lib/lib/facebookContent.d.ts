export declare const generateWebviewBooking: (psId: any, hotel: any, customerName: any) => {
    recipient: {
        id: any;
    };
    message: {
        attachment: {
            type: string;
            payload: {
                template_type: string;
                text: string;
                buttons: {
                    type: string;
                    url: string;
                    title: string;
                    webview_height_ratio: string;
                    messenger_extensions: boolean;
                }[];
            };
        };
    };
};
export declare const menuWelcomeMessage: (psId: any, hotel: any) => {
    recipient: {
        id: any;
    };
    message: {
        attachment: {
            type: string;
            payload: {
                template_type: string;
                elements: {
                    title: any;
                    image_url: any;
                }[];
                image_aspect_ratio: string;
            };
        };
    };
};
