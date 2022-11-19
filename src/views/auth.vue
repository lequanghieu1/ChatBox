<template>
  <router-link v-if="isLogin()" to="/orders">Danh sách đơn hàng</router-link>
  <div class="h-[100vh] flex justify-center items-center flex-col">
    <div class="flex justify-between items-center">
      <p>App ID</p>
      <input
        type="text"
        pattern="\d*"
        maxlength="5"
        v-model="appId"
        @input="numberValidate"
        class="border border-gray-400 pl-3 h-6 rounded-md text-xs w-1/2 placeholder:pl-3 placeholder:text-xs"
      />
    </div>
    <div class="flex justify-around items-center mt-3">
      <p>Secret Key</p>
      <input
        v-model="secretKey"
        class="border border-gray-400 pl-3 h-6 rounded-md text-xs w-1/2 placeholder:pl-3 placeholder:text-xs"
      />
    </div>
    <div class="flex justify-around items-center mt-3">
      <p>Return Link</p>
      <input
        v-model="returnLink"
        type="url"
        class="border border-gray-400 pl-3 h-6 rounded-md text-xs w-1/2 placeholder:pl-3 placeholder:text-xs"
      />
    </div>

    <button
      v-if="!isLogin()"
      class="font-bold bg-sky-600 p-2 rounded text-md text-white h-10 w-32 mt-4"
      :class="
        !isValidHttpUrl(returnLink) || !appId || !secretKey ? 'opacity-50' : ''
      "
      @click="Auth()"
      :disabled="!isValidHttpUrl(returnLink) || !appId || !secretKey"
    >
      Kích hoạt
    </button>
    <button
      v-else
      class="font-bold bg-red-500 p-2 rounded text-md text-white h-10 w-32"
      @click="Logout()"
    >
      Ngắt kết nối
    </button>
  </div>
</template>
<script setup>
import { saveConfig } from "../common/sdkMethods.js";
import { useRouter } from "vue-router";
import { ref } from "vue";
import { numberOnly } from "../common/convert";

const appId = ref("");
const secretKey = ref("");
const returnLink = ref("");
const otherApp = ref(false);

const numberValidate = () => {
  appId.value = numberOnly(appId.value);
};

const router = useRouter();
// import useEmitter from "../common/bus.js";
// const emitter = useEmitter();
// emitter.on("tokenSuccess", () => {
//   console.log('hihihihi')
// });
const Auth = () => {
  localStorage.setItem(
    "infoApp",
    JSON.stringify({ appId: appId.value, secretKey: secretKey.value })
  );
  window.addEventListener("storage", message_receive);
  window.open(
    `https://nhanh.vn/oauth?appId=${appId.value || 73006}&returnLink=${
      returnLink.value || "https://hihihaha.vercel.app/access"
    }`,
    "chromeTab",
    "popup"
  );
};
const message_receive = (e) => {
  if (e.key == "broadcast") {
    window.removeEventListener("storage", message_receive);
    localStorage.removeItem("broadcast");
    router.push({
      path: "/auth",
      query: {
        access_token: localStorage.getItem("token-chat-box").split("=")[1],
      },
    });
  }
};
const Logout = () => {
  sessionStorage.clear();
  location.reload();
  saveConfig(null);
};

const isValidHttpUrl = (string) => {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
};

const isLogin = () => {
  return sessionStorage.getItem("token");
};
</script>
