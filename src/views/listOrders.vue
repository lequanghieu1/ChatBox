<template>
  <load v-if="(!orderList.length && !noRecord) || loading" />
  <div class="flex justify-around items-center">
    <div class="h-[24px] w-[24px]"></div>
    <div
      class="w-3/5 h-[34px] bg-[#E3E8EF] rounded-lg mt-[5px] flex items-center justify-around"
    >
      <button
        class="w-5/12 rounded-md h-[24px] text-xs"
        @click="resetTab"
        :class="
          tabIndex === 1 ? 'bg-[#4A5667] text-white' : 'bg-[#E3E8EF] text-black'
        "
      >
        Đơn hàng
      </button>
      <button
        class="w-5/12 rounded-md h-[24px] text-xs"
        @click="tabIndex = 2"
        :class="
          tabIndex === 2 ? 'bg-[#4A5667] text-white' : 'bg-[#E3E8EF] text-black'
        "
      >
        {{ tabTwo }}
      </button>
    </div>
    <img src="../assets/icons/setting.svg" @click="gotoAuth" />
  </div>
  <div class="flex justify-center items-center h-screen w-full h-[20px] mt-4">
    <input
      class="border border-gray-400 pl-3 h-5 rounded-md text-xs w-3/5 placeholder:pl-3 placeholder:text-xs"
      placeholder="Tìm kiếm SĐT"
      v-model="phone"
    />
    <p
      class="text-xs text-violet-800 font-medium cursor-pointer ml-3"
      @click="getListOrder(true)"
    >
      Tìm kiếm
    </p>
  </div>

  <div v-if="noRecord" class="flex justify-center items-center h-screen">
    <p>chưa có đơn hàng nào</p>
  </div>
  <div class="mt-2" v-if="tabIndex === 1">
    <div class="mt-2" v-for="(order, index) in orderList" :key="order.id">
      <orderDetail
        :order="order"
        @editOrder="editOrder"
        @openOrder="openOrder"
        :index="index"
      />
    </div>
  </div>
  <div class="mt-2" v-if="tabIndex === 2">
    <createOrder
      :info="objEdit"
      :loading="loading"
      @status="updateStatus"
      class="mt-2"
      :isEdit="isEdit"
      @afterUpdate="resetTab"
    />
  </div>

  <button
    v-if="tabIndex === 1"
    class="bg-blue-500 w-full rounded-md h-8 text-white text-base mt-2"
    @click="getListOrder(1)"
  >
    Xem thêm
  </button>
</template>
<script setup>
import { ref, onMounted } from "vue";
import orderDetail from "./orderDetail.vue";
import createOrder from "./createEditOrder.vue";
import load from "../components/load.vue";
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
const noRecord = ref(false);
let timeCall = ref(2);
let loading = ref(false);
const profile = structuredClone(store.getProfile);
let phone = ref(profile.phone);

onMounted(async () => {
  await resetTab();
});

const getListOrder = async (val) => {
  const obj = { ...store.data };
  let phoneObj = null;
  if (Number.isInteger(val)) {
    phoneObj = { page: timeCall.value };
    timeCall.value++;
  }
  if (val === true) {
    phoneObj = { customerMobile: phone.value };
  }
  obj.accessToken = sessionStorage.getItem("token");
  const response = await HTTP(`order/index`, obj, phoneObj);
  orderList.value = convertObject(response.data?.data?.data?.orders || {}).map(
    (e) => {
      return { ...e, isOpen: false };
    }
  );
  if (!orderList.value.length) {
    noRecord.value = true;
  }
};
const editOrder = (orderId) => {
  router.push({ path: "/orders", query: { orderId } });
  objEdit.value = orderList.value.find((e) => e.id === orderId) || {};
  tabIndex.value = 2;
  tabTwo.value = `#${orderId}`;
  isEdit.value = true;
};

const updateStatus = (value) => {
  console.log(value);
  loading.value = value || false;
};

const openOrder = (index) => {
  orderList.value[index].isOpen = !orderList.value[index].isOpen;
};

const gotoAuth = () => {
  router.push({
    path: "/getToken",
    query: {
      access_token: localStorage.getItem("token-chat-box").split("=")[1],
    },
  });
};

const resetTab = async () => {
  tabIndex.value = 1;
  router.push({ path: "/orders", query: {} });
  tabTwo.value = "Tạo đơn";
  isEdit.value = false;
  await getListOrder();
};
</script>
