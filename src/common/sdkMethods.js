export const initSdkApp = () => {
  const show_log = false;
  const secret_key = "201d836cc4bc4d58b4c2e359b90a3e63";
  try {
    window.Sdk = new ChatboxSdk({ secret_key, show_log });
    Sdk.init();
    Sdk.getCustomerInfo((e, r) => {
      console.log(e, r);
    });
  } catch (error) {
    console.log(error);
  }
};

export const saveConfig = access_token => {
  let objData = {};
  if (access_token) {
    objData = { token: access_token };
  }
  Sdk.saveConfig(
    {
      type_config: "CRM",
      brand_name: "nhanh.vn",
      config_data: structuredClone(objData),
    },
    (e, r) => {
      console.log(e);
      console.log("save config result", r);
    }
  );
};
