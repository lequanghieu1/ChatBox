import axios from "axios";

export const HTTP = async (uri, obj, data, total_price) => {
  let version = {};
  const post_data = { ...obj };
  const key = localStorage.getItem("key");
  const total = {};
  if (data && Object.keys(data).length) {
    post_data.data = JSON.stringify(data);
  }
  if (uri) {
    version = {
      businessId: JSON.parse(localStorage.getItem("infoApp"))?.[key].businessId,
      version: "2.0",
    };
  }
  if (Number.isInteger(total_price)) {
    total.total_price = total_price;
  }
  return await axios.post(
    "https://chatbox-widget.botbanhang.vn/v1/proxy/nhanhvn",
    {
      uri: uri
        ? `https://open.nhanh.vn/api/${uri}`
        : "https://nhanh.vn/oauth/access_token",
      post_data: { ...post_data, ...version },
      ...total,
    },
    {
      headers: {
        Authorization: Sdk.access_token,
      },
    }
  );
};
