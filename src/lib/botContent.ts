import {
  CardFactory,
  Attachment,
  ActionTypes,
} from "botbuilder";

export function webviewBookingContent(psId, hotel, channel, customerName): Attachment {
  return CardFactory.heroCard(
    `Để xem giá ƯU ĐÃI dành riêng cho ${customerName}, bạn vui lòng nhấn nút TÌM PHÒNG 👇 bên dưới nhé.`,
    CardFactory.images([]),
    CardFactory.actions([
      {
        type: ActionTypes.OpenUrl,
        title: "TÌM PHÒNG",
        value: `${process.env.HERMES2_WEBVIEW}/webview/booking-flexible?hotelId=${hotel.slug}&userId=${psId}&channel=${channel}`,
      },
    ]),
  );
}

export function mainMenuContent(psId, hotel, customerName): Attachment {
  return CardFactory.heroCard(
    hotel.name,
    `Chào mừng ${customerName} đến với ${hotel.name}.
    Chúng tôi luôn có giá ưu đãi khi bạn đặt phòng trực tiếp tại đây. 
    Trong trường hợp khẩn cấp hãy gọi số điện thoại hỗ trợ ${hotel.staff_phone_number} ${hotel.staff_name}`,
    CardFactory.images([hotel.featured_image_path]),
    CardFactory.actions([
      {
        type: ActionTypes.PostBack,
        title: "🛎️ Tôi muốn xem phòng",
        value: `VIEW_ROOMS`,
      },
      {
        type: ActionTypes.OpenUrl,
        title: "💵 Mua/Sử dụng voucher",
        value: `${process.env.HERMES_WEBVIEW}/botman/voucher?hotelId=${hotel.slug}&userId=${psId}&channel=Facebook`,
      },
      {
        type: ActionTypes.PostBack,
        title: "🏨 Thông tin khách sạn",
        value: "HOTEL_INFO",
      },
    ])
  );
}

export function hotelInfoContent(psId, hotel, facilities): Attachment[] {
  const roomMessage = `${hotel.name} có ${hotel.rooms.length} loại phòng khác nhau và các tiện ích`;
  const randomRoom = hotel.rooms[Math.floor(Math.random() * hotel.rooms.length)];
  const introRoom = CardFactory.heroCard(
   'Các loại phòng',
   roomMessage,
   CardFactory.images([randomRoom.featured_image]),
   CardFactory.actions([
      {
        type: ActionTypes.PostBack,
        title: 'Xem thêm',
        value: `VIEW_ROOMS`,
      },
    ])
  );
  const cards = facilities.map(facility => {
    return CardFactory.heroCard(
      facility.name,
      CardFactory.images([facility.featured_image_path]),
      CardFactory.actions([
        {
          type: ActionTypes.PostBack,
          title: 'Xem thêm',
          value: `SHOW_FACILITY-${facility.id}`,
        }
      ])
    )
  });
  cards.unshift(introRoom); 
  return cards;
}

export function callHotelContent(psId, hotel, customerName) {
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
