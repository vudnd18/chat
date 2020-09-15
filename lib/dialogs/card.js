"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingCard = exports.mainMenuCardButton = void 0;
const botbuilder_1 = require("botbuilder");
function mainMenuCardButton() {
    return botbuilder_1.CardFactory.heroCard("Bắt đầu", `Chào mừng Vũ đến với Chinh's Staging Hotel.
    Chúng tôi luôn có giá ưu đãi khi bạn đặt phòng trực tiếp tại đây. Trong trường hợp khẩn cấp hãy gọi số điện thoại hỗ trợ`, botbuilder_1.CardFactory.images([
        "https://d15pd1l2k1p66y.cloudfront.net/media/facilities/wfjj7KkqOTd9CZF7Roec3ZFZXgLvG1GMI34xoKBY.jpeg"
    ]), botbuilder_1.CardFactory.actions([
        {
            type: botbuilder_1.ActionTypes.OpenUrl,
            title: "Tôi muốn xem phòng",
            value: "https://hermes-v2-staging.innaway.co/"
        },
        {
            type: botbuilder_1.ActionTypes.OpenUrl,
            title: "Mua/ Sử dụng voucher",
            value: "https://hermes-v2-staging.innaway.co/"
        },
        {
            type: botbuilder_1.ActionTypes.OpenUrl,
            title: "Thông tin khách sạn",
            value: "https://hermes-v2-staging.innaway.co/"
        }
    ]));
}
exports.mainMenuCardButton = mainMenuCardButton;
function bookingCard() {
    return botbuilder_1.CardFactory.heroCard("Booking Room", `Để xem giá ƯU ĐÃI dành riêng cho Vũ, bạn vui lòng nhấn nút TÌM PHÒNG 👇 bên dưới nhé.`, botbuilder_1.CardFactory.images([""]), botbuilder_1.CardFactory.actions([
        {
            type: botbuilder_1.ActionTypes.OpenUrl,
            title: "Tìm phòng",
            value: "https://hermes-v2-staging.innaway.co/webview/booking-flexible?hotelId=chinh-staging&userId=3447555485284781&channel=Facebook"
        }
    ]));
}
exports.bookingCard = bookingCard;
//# sourceMappingURL=card.js.map