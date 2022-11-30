import { setting } from "../common/config";
export const initSdkApp = () => {
  const { secretKeyWidget, show_log } = setting;
  try {
    window.Sdk = new ChatboxSdk({ secret_key: secretKeyWidget, show_log });
    Sdk.init();
  } catch (error) {
    console.log(error);
  }
};

export const saveConfig = objData => {
  let config = {};
  if (objData) {
    config = objData;
  }
  Sdk.saveConfig(
    {
      type_config: "CRM",
      brand_name: "nhanh.vn",
      config_data: structuredClone(config),
    },
    (e, r) => {
      console.log(e);
      console.log("save config result", r);
    }
  );
};
