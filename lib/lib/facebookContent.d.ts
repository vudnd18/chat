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
export declare const menuButtonMessage: (psId: any, hotel: any, customerName: any) => {
    recipient: {
        id: any;
    };
    message: {
        attachment: {
            type: string;
            payload: {
                template_type: string;
                text: string;
                buttons: any[];
            };
        };
    };
};
export declare const hotelInfoMessage: (psId: any, hotel: any, facilities: any) => {
    recipient: {
        id: any;
    };
    message: {
        attachment: {
            type: string;
            payload: {
                template_type: string;
                elements: any[];
                image_aspect_ratio: string;
            };
        };
    };
};
export declare const callHotelMessage: (psId: any, hotel: any) => {
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
                    payload: any;
                    title: string;
                }[];
            };
        };
    };
};
