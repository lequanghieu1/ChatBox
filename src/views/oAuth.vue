<template>
  <div class="w-full h-screen flex justify-center items-center">
    <div class="w-40 flex justify-between items-center" >
          <p class="text-sm font-medium" :class="color(order.statusCode)">
            {{ order.id }}
          </p>
          <img
            class="cursor-pointer mr-1"
            @mouseover="noteTooltip = 'Nhắn tin'"
            @mouseleave="noteTooltip = ''"
            src="../assets/icons/chat.svg"
          />
          <div
            class="cursor-pointer mr-1 bg-[url('../assets/icons/share.svg')] w-4 h-4"
            @mouseover="noteTooltip = 'Xem đơn(nhanh.vn)'"
            @mouseleave="noteTooltip = ''"
            @click.stop.prevent="gotoNhanh"
          ></div>
          <img
            class="cursor-pointer"
            @mouseover="noteTooltip = 'Sửa đơn'"
            @mouseleave="noteTooltip = ''"
            src="../assets/icons/order.svg"
            @click="$emit('editOrder', order.id)"
          />
        </div>
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
