<template>
  <div class="w-full h-screen flex justify-center items-center">
    <button
      class="font-bold bg-sky-600 p-3 rounded text-white h-16 w-40"
      @click="AppOauth"
    >
      Kích hoạt
    </button>
  </div>
</template>
<script setup>
import { initSdkApp } from "../common/sdkMethods.js";
import { onMounted } from "vue";
onMounted(async () => {
  await initSdkApp();
});
const AppOauth = async () => {
  await Sdk.doAppOAuth();
  alert("Kích hoạt thành công");
  setTimeout(() => window.close(), 1000);
};
</script>
