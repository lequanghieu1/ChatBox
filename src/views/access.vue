<template>
  <div class="h-[100vh] flex justify-center items-center flex-col">
    <img src="../assets/icons/access.svg" />
    <p class="text-base font-medium mt-1.5">Kết nối thành công</p>
    <p class="text-gray-500 text-xs mt-3">{{ note }}</p>
  </div>
</template>
<script setup>
import { computed, ref, watch, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { HTTP } from "../common/api";
import { useFormBody } from "../store/store";
// import useEmitter from "../common/bus.js";
import { saveConfig, initSdkApp } from "../common/sdkMethods.js";
// const emitter = useEmitter();
const router = useRouter();
const route = useRoute();


onMounted(async () => {
  if (localStorage.getItem("token-chat-box")) {
    await router.push(`${route.fullPath}&${localStorage.getItem("token-chat-box")}`);
  }
  await initSdkApp();
  await getToken();
});
const store = useFormBody();
const obj = { ...store.data };
const infoApp = JSON.parse(localStorage.getItem('infoApp'))
if(infoApp.appId){
  obj.appId = infoApp.appId
}
if(infoApp.secretKey){
  obj.secretKey = infoApp.secretKey
}
obj.accessCode = router.currentRoute.value.query.accessCode || "";
let time = ref(5);

const note = computed(() => {
  if (time.value > 0) {
    setTimeout(() => {
      time.value--;
    }, 1000);
  }
  return `Vui lòng chờ trong ${time.value}s... hệ thống cập nhật`;
});
const getToken = async () => {
  const response = await HTTP(null, obj, null);
  obj.businessId = response.data.data.businessId
  delete obj.accessCode
  localStorage.setItem('infoApp', JSON.stringify(obj))
  const token = response.data.data.accessToken;
  sessionStorage.setItem("token", token);
  saveConfig({...obj,token});
};
watch(time, (val) => {
  if (!val) {
    localStorage.setItem('broadcast', Math.random().toString())
    window.close()
  }
});
</script>
