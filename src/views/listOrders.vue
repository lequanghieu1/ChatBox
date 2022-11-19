<template>
  <loading v-if="!orderList.length" />
  <div class="flex justify-end">
    <div class="w-3/5 h-[34px] bg-[#E3E8EF] rounded-lg mt-[5px] mr-5 flex items-center justify-around">
      <button class="w-5/12 rounded-md h-[24px] text-xs" @click="resetTab" :class="
        tabIndex === 1 ? 'bg-[#4A5667] text-white' : 'bg-[#E3E8EF] text-black'
      ">
        Đơn hàng
      </button>
      <button class="w-5/12 rounded-md h-[24px] text-xs" @click="tabIndex = 2" :class="
        tabIndex === 2 ? 'bg-[#4A5667] text-white' : 'bg-[#E3E8EF] text-black'
      ">
        {{ tabTwo }}
      </button>
    </div>
    <img src="../assets/icons/setting.svg" class="mx-3" @click="gotoAuth" />
  </div>
  <p>chưa có đơn hàng nào</p> 
  <div class="mt-2" v-if="tabIndex === 1">
    <div class="mt-2" v-for="(order, index) in orderList" :key="order.id">
      <orderDetail :order="order" @editOrder="editOrder" @openOrder="openOrder" :index="index" />
    </div>
  </div>
  <div class="mt-2" v-if="tabIndex === 2">
    <createOrder :info="objEdit" class="mt-2" :isEdit="isEdit" @afterUpdate="resetTab" />
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import orderDetail from "./orderDetail.vue";
import createOrder from "./createEditOrder.vue";
import loading from "../components/loading.vue";
import { useRouter } from "vue-router";
import { HTTP } from "../common/api";
import { convertObject } from "../common/convert";
import { useFormBody } from "../store/store";

const store = useFormBody();
let orderList = ref([]);
let isEdit = ref(false);
let objEdit = ref([]);
const router = useRouter();
let tabIndex = ref(1);
const tabTwo = ref("Tạo đơn");

onMounted(async () => {
  resetTab();
  await getListOrder();
});

const getListOrder = async () => {
  const obj = { ...store.data };
  obj.accessToken = sessionStorage.getItem('token')
  const response = await HTTP(`order/index`, obj, null);
  orderList.value = convertObject(response.data?.data?.data?.orders || {}).map((e) => {
    return { ...e, isOpen: false };
  });
  if(!orderList.length){

  }
};
const editOrder = (orderId) => {
  router.push({ path: "/orders", query: { orderId } });
  objEdit.value = orderList.value.find((e) => e.id === orderId) || {};
  tabIndex.value = 2;
  tabTwo.value = `#${orderId}`;
  isEdit.value = true;
};

const openOrder = (index) => {
  orderList.value[index].isOpen = !orderList.value[index].isOpen;
};

const gotoAuth = () => {
  router.push({ path: "/getToken", query: { access_token: localStorage.getItem("token-chat-box").split('=')[1] } });
};

const resetTab = () => {
  tabIndex.value = 1;
  router.push({ path: "/orders", query: {} });
  tabTwo.value = "Tạo đơn";
  isEdit.value = false;
};
</script>
