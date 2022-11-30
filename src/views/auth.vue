<template>
  <button
    v-if="isLogin()"
    class="bg-indigo-600 w-full rounded-md h-8 text-white text-base mt-2"
  >
    <router-link v-if="isLogin()" to="/orders">Danh sách đơn hàng</router-link>
  </button>

  <div class="h-[100vh] flex justify-center items-center flex-col">
    <div class="flex justify-between items-center" v-if="otherApp">
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
    <div class="flex justify-around items-center mt-3" v-if="otherApp">
      <p>Secret Key</p>
      <input
        v-model="secretKey"
        class="border border-gray-400 pl-3 h-6 rounded-md text-xs w-1/2 placeholder:pl-3 placeholder:text-xs"
      />
    </div>
    <div class="flex justify-around items-center mt-3" v-if="otherApp">
      <p>Return Link</p>
      <input
        v-model="returnLink"
        type="url"
        class="border border-gray-400 pl-3 h-6 rounded-md text-xs w-1/2 placeholder:pl-3 placeholder:text-xs"
      />
    </div>
    <div class="flex justify-around items-center mt-3" v-if="!isLogin()">
      <input type="checkbox" name="vehicle1" v-model="otherApp" />
      <label for="vehicle1" class="ml-1"> Chọn app khác</label><br />
    </div>

    <button
      v-if="!isLogin()"
      class="font-bold bg-sky-600 p-2 rounded text-md text-white h-10 w-32 mt-4"
      :class="isDisabled ? 'opacity-50' : ''"
      @click="Auth()"
      :disabled="isDisabled"
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
import { ref, computed } from "vue";
import { numberOnly } from "../common/convert";
import { setting } from "../common/config";

const appId = ref("");
const secretKey = ref("");
const returnLink = ref("");
const otherApp = ref(false);

const numberValidate = () => {
  appId.value = numberOnly(appId.value);
};

const isDisabled = computed(() => {
  return (
    otherApp.value &&
    (!isValidHttpUrl(returnLink.value) || !appId.value || !secretKey.value)
  );
});

const router = useRouter();
// import useEmitter from "../common/bus.js";
// const emitter = useEmitter();
// emitter.on("tokenSuccess", () => {
//   console.log('hihihihi')
// });
const Auth = () => {
  localStorage.setItem(
    "infoApp",
    JSON.stringify({
      appId: otherApp.value ? appId.value : setting.appId,
      secretKey: otherApp.value ? secretKey.value : setting.secretKey,
    })
  );
  window.addEventListener("storage", message_receive);
  window.open(
    `https://nhanh.vn/oauth?appId=${
      otherApp.value ? appId.value : setting.appId
    }&returnLink=${otherApp.value ? returnLink.value : setting.returnLink}`,
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
  saveConfig(null);
  router.push("/auth");
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
