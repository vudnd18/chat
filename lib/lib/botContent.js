"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.callHotelContent = exports.hotelInfoContent = exports.mainMenuContent = exports.webviewBookingContent = void 0;
const botbuilder_1 = require("botbuilder");
function webviewBookingContent(psId, hotel, channel, customerName) {
    return botbuilder_1.CardFactory.heroCard(`Để xem giá ƯU ĐÃI dành riêng cho ${customerName}, bạn vui lòng nhấn nút TÌM PHÒNG 👇 bên dưới nhé.`, botbuilder_1.CardFactory.images([]), botbuilder_1.CardFactory.actions([
        {
            type: botbuilder_1.ActionTypes.OpenUrl,
            title: "TÌM PHÒNG",
            value: `${process.env.HERMES2_WEBVIEW}/webview/booking-flexible?hotelId=${hotel.slug}&userId=${psId}&channel=${channel}`,
        },
    ]));
}
exports.webviewBookingContent = webviewBookingContent;
function mainMenuContent(psId, hotel, customerName) {
    return botbuilder_1.CardFactory.heroCard(hotel.name, `Chào mừng ${customerName} đến với ${hotel.name}.
    Chúng tôi luôn có giá ưu đãi khi bạn đặt phòng trực tiếp tại đây. 
    Trong trường hợp khẩn cấp hãy gọi số điện thoại hỗ trợ ${hotel.staff_phone_number} ${hotel.staff_name}`, botbuilder_1.CardFactory.images([hotel.featured_image_path]), botbuilder_1.CardFactory.actions([
        {
            type: botbuilder_1.ActionTypes.PostBack,
            title: "🛎️ Tôi muốn xem phòng",
            value: `VIEW_ROOMS`,
        },
        {
            type: botbuilder_1.ActionTypes.OpenUrl,
            title: "💵 Mua/Sử dụng voucher",
            value: `${process.env.HERMES_WEBVIEW}/botman/voucher?hotelId=${hotel.slug}&userId=${psId}&channel=Facebook`,
        },
        {
            type: botbuilder_1.ActionTypes.PostBack,
            title: "🏨 Thông tin khách sạn",
            value: "HOTEL_INFO",
        },
    ]));
}
exports.mainMenuContent = mainMenuContent;
function hotelInfoContent(psId, hotel, facilities) {
    const roomMessage = `${hotel.name} có ${hotel.rooms.length} loại phòng khác nhau và các tiện ích`;
    const randomRoom = hotel.rooms[Math.floor(Math.random() * hotel.rooms.length)];
    const introRoom = botbuilder_1.CardFactory.heroCard('Các loại phòng', roomMessage, botbuilder_1.CardFactory.images([randomRoom.featured_image]), botbuilder_1.CardFactory.actions([
        {
            type: botbuilder_1.ActionTypes.PostBack,
            title: 'Xem thêm',
            value: `VIEW_ROOMS`,
        },
    ]));
    const cards = facilities.map(facility => {
        return botbuilder_1.CardFactory.heroCard(facility.name, botbuilder_1.CardFactory.images([facility.featured_image_path]), botbuilder_1.CardFactory.actions([
            {
                type: botbuilder_1.ActionTypes.PostBack,
                title: 'Xem thêm',
                value: `SHOW_FACILITY-${facility.id}`,
            }
        ]));
    });
    cards.unshift(introRoom);
    return cards;
}
exports.hotelInfoContent = hotelInfoContent;
function callHotelContent(psId, hotel, customerName) {
    return {
        type: "AdaptiveCard",
        version: "1.0",
        body: [
            {
                type: "TextBlock",
                spacing: "medium",
                size: "default",
                weight: "normal",
                text: "Call our representative ?",
                wrap: true,
                maxLines: 0,
            },
        ],
        actions: [
            {
                type: "Action.OpenUrl",
                title: "Call representative",
                url: `tel:${hotel.staff_phone_number}`,
            },
        ],
    };
}
exports.callHotelContent = callHotelContent;
//# sourceMappingURL=botContent.js.map