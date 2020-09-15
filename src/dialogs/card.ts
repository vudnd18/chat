import {
  MessageFactory,
  Activity,
  CardFactory,
  Attachment,
  ActionTypes
} from "botbuilder";

export function mainMenuCardButton(): Attachment {
  return CardFactory.heroCard(
    "Bắt đầu",
    `Chào mừng Vũ đến với Chinh's Staging Hotel.
    Chúng tôi luôn có giá ưu đãi khi bạn đặt phòng trực tiếp tại đây. Trong trường hợp khẩn cấp hãy gọi số điện thoại hỗ trợ`,
    CardFactory.images([
      "https://d15pd1l2k1p66y.cloudfront.net/media/facilities/wfjj7KkqOTd9CZF7Roec3ZFZXgLvG1GMI34xoKBY.jpeg"
    ]),
    CardFactory.actions([
      {
        type: ActionTypes.OpenUrl,
        title: "Tôi muốn xem phòng",
        value: "https://hermes-v2-staging.innaway.co/"
      },
      {
        type: ActionTypes.OpenUrl,
        title: "Mua/ Sử dụng voucher",
        value: "https://hermes-v2-staging.innaway.co/"
      },
      {
        type: ActionTypes.OpenUrl,
        title: "Thông tin khách sạn",
        value: "https://hermes-v2-staging.innaway.co/"
      }
    ])
  );
}

export function bookingCard(): Attachment {
  return CardFactory.heroCard(
    "Booking Room",
    `Để xem giá ƯU ĐÃI dành riêng cho Vũ, bạn vui lòng nhấn nút TÌM PHÒNG 👇 bên dưới nhé.`,
    CardFactory.images([""]),
    CardFactory.actions([
      {
        type: ActionTypes.OpenUrl,
        title: "Tìm phòng",
        value:
          "https://hermes-v2-staging.innaway.co/webview/booking-flexible?hotelId=chinh-staging&userId=3447555485284781&channel=Facebook"
      }
    ])
  );
}
