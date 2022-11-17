import axios from "axios";

export const HTTP = async (uri, obj, data) => {
  let version = {};
  const post_data = { ...obj };
  if (data && Object.keys(data).length) {
    post_data.data = JSON.stringify(data);
  }
  if (uri) {
    version = { businessId: 136439, version: "2.0" };
  }
  return await axios.post(
    "https://chatbox-widget.botbanhang.vn/v1/proxy/nhanhvn",
    {
      uri: uri
        ? `https://open.nhanh.vn/api/${uri}`
        : "https://nhanh.vn/oauth/access_token",
      post_data: { ...post_data, ...version },
    }
  );
};
