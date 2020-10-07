export const generateWebviewBooking = (psId, hotel, customerName) => {
  return {
    recipient: {
      id: psId,
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: `Để xem giá ƯU ĐÃI dành riêng cho ${customerName}, bạn vui lòng nhấn nút TÌM PHÒNG 👇 bên dưới nhé.`,
          buttons: [
            {
              type: "web_url",
              url: `${process.env.HERMES2_WEBVIEW}/webview/booking-flexible?hotelId=${hotel.slug}&userId=${psId}&channel=Facebook`,
              title: "TÌM PHÒNG",
              webview_height_ratio: "tall",
              messenger_extensions: true,
            },
          ],
        },
      },
    },
  };
};

export const menuWelcomeMessage = (psId, hotel) => {
  return {
    recipient: {
      id: psId,
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [
            {
              title: hotel.name,
              image_url: hotel.featured_image_path,
            },
          ],
          image_aspect_ratio: "square",
        },
      },
    },
  };
};
