"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.callHotelMessage = exports.hotelInfoMessage = exports.menuButtonMessage = exports.menuWelcomeMessage = exports.generateWebviewBooking = void 0;
exports.generateWebviewBooking = (psId, hotel, customerName) => {
    return {
        recipient: {
            id: psId
        },
        message: {
            attachment: {
                type: 'template',
                payload: {
                    template_type: 'button',
                    text: `Để xem giá ƯU ĐÃI dành riêng cho ${customerName}, bạn vui lòng nhấn nút TÌM PHÒNG 👇 bên dưới nhé.`,
                    buttons: [
                        {
                            type: 'web_url',
                            url: `${process.env.HERMES2_WEBVIEW}/webview/booking-flexible?hotelId=${hotel.slug}&userId=${psId}&channel=Facebook`,
                            title: 'TÌM PHÒNG',
                            webview_height_ratio: 'tall',
                            messenger_extensions: true
                        }
                    ]
                }
            }
        }
    };
};
exports.menuWelcomeMessage = (psId, hotel) => {
    return {
        recipient: {
            id: psId
        },
        message: {
            attachment: {
                type: 'template',
                payload: {
                    template_type: 'generic',
                    elements: [
                        {
                            title: hotel.name,
                            image_url: hotel.featured_image_path
                        }
                    ],
                    image_aspect_ratio: 'square'
                }
            }
        }
    };
};
exports.menuButtonMessage = (psId, hotel, customerName) => {
    const content = {
        recipient: {
            id: psId
        },
        message: {
            attachment: {
                type: 'template',
                payload: {
                    template_type: 'button',
                    text: `
          Chào mừng ${customerName} đến với ${hotel.name}.
          Chúng tôi luôn có giá ưu đãi khi bạn đặt phòng trực tiếp tại đây.Trong trường hợp khẩn cấp hãy gọi số điện thoại hỗ trợ ${hotel.staff_phone_number} ${hotel.staff_name}

          Vui lòng chọn 1 lựa chọn bên dưới để tiếp tục 👇`,
                    buttons: [],
                }
            }
        }
    };
    let buttons = [];
    const buttonViewRoom = {
        type: 'postback',
        title: '🛎️ Tôi muốn xem phòng',
        payload: 'VIEW_ROOMS'
    };
    buttons.push(buttonViewRoom);
    if (hotel.show_voucher) {
        const buttonShowVoucher = {
            type: 'web_url',
            url: `${process.env.HERMES_WEBVIEW}/botman/voucher?hotelId=${hotel.slug}&userId=${psId}&channel=Facebook`,
            title: '💵 Mua/Sử dụng voucher',
            webview_height_ratio: 'tall',
            messenger_extensions: true
        };
        buttons.push(buttonShowVoucher);
    }
    const buttonHotelInfo = {
        type: 'postback',
        title: '🏨 Thông tin khách sạn',
        payload: 'HOTEL_INFO'
    };
    buttons.push(buttonHotelInfo);
    content.message.attachment.payload.buttons = buttons;
    return content;
};
exports.hotelInfoMessage = (psId, hotel, facilities) => {
    let elements = [];
    const roomMessage = `${hotel.name} có ${hotel.rooms.length} loại phòng khác nhau và các tiện ích`;
    const randomRoom = hotel.rooms[Math.floor(Math.random() * hotel.rooms.length)];
    const introRoomElement = {
        title: 'Các loại phòng',
        subtitle: roomMessage,
        image_url: randomRoom.featured_image,
        buttons: [{
                type: 'postback',
                title: 'Xem thêm',
                payload: 'VIEW_ROOMS'
            }]
    };
    elements.push(introRoomElement);
    console.log(facilities);
    // Facilities
    facilities.map(facility => {
        const element = {
            title: facility.name,
            image_url: facility.featured_image_path,
            buttons: [{
                    type: 'postback',
                    title: 'Xem thêm',
                    payload: `SHOW_FACILITY-${facility.id}`
                }]
        };
        elements.push(element);
    });
    const content = {
        recipient: {
            id: psId
        },
        message: {
            attachment: {
                type: 'template',
                payload: {
                    template_type: 'generic',
                    elements: [],
                    image_aspect_ratio: 'square'
                }
            }
        }
    };
    content.message.attachment.payload.elements = elements;
    return content;
};
exports.callHotelMessage = (psId, hotel) => {
    return {
        recipient: {
            id: psId
        },
        message: {
            attachment: {
                type: 'template',
                payload: {
                    template_type: 'button',
                    text: `Call our representative ?`,
                    buttons: [
                        {
                            type: 'phone_number',
                            payload: hotel.staff_phone_number,
                            title: 'Call representative',
                        }
                    ]
                }
            }
        }
    };
};
//# sourceMappingURL=facebookContent.js.map