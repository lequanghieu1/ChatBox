<template>
  <div class="p-5">
    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
        Tên khách hàng
      </label>
      <input
        class="
          shadow
          appearance-none
          border
          rounded
          w-full
          py-2
          px-3
          text-gray-700
          leading-tight
          focus:outline-none focus:shadow-outline
        "
        type="text"
        v-model="api_data.public_profile.client_name"
      />
    </div>
    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
        Tên page
      </label>
      <input
        class="
          shadow
          appearance-none
          rounded
          w-full
          py-2
          px-3
          text-gray-700
          mb-3
          leading-tight
          focus:outline-none focus:shadow-outline
        "
        v-model="api_data.public_profile.page_name"
      />
    </div>
    <div class="flex items-center justify-center">
      <button
        class="
          bg-blue-500
          hover:bg-blue-700
          text-white
          font-bold
          py-2
          px-4
          rounded
          focus:outline-none focus:shadow-outline
        "
        type="button"
        @click="getConfig()"
      >
        Tạo order
      </button>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import "@/assets/tailwind.css";
import _ from "lodash";

export default {
  setup() {
    let api_data = ref({
      public_profile: {},
    });

    Sdk.getCustomerInfo((e, r) => {
      if (e) return console.log(e);
      api_data.value = _.get(r, "data");
    });

    const createOrder = () => {
      fetch("http://ip-api.com/json/")
        .then((response) => response.json())
        .then((data) => console.log(data));
    };

    const saveConfig = () => {
      Sdk.saveConfig(
        {
          type_config: "CRM",
          brand_name: "nhanh.vn",
          config_data: {
            token: "123456789xyz",
          },
        },
        (e, r) => {
          if (e) console.log(e);
          console.log("save config result", r);
        }
      );
    };

    const getConfig = () => {
      Sdk.getConfig(
        {
          type_config: "CRM",
          brand_name: "nhanh.vn",
        },
        (e, r) => {
          if (e) console.log(e);
          console.log("get config result", r);
        }
      );
    };

    const sendMessage = () => {

      Sdk.sendMessage(
        {
          messages: [
            { text: "Chào mừng bạn đến với Bot Bán Hàng!" },
            { text: "Chúng tôi có thể giúp gì cho bạn?" },
          ],
        },
        (e, r) => {
          if (e) console.log(e);
          console.log("send message result", r);
        }
      );
    };

    return { api_data, createOrder, saveConfig, getConfig, sendMessage };
  },
};
</script>

<style scoped lang="scss">
</style>