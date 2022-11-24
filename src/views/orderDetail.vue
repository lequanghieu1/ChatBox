<template>
  <div
    class="w-full rounded-md cursor-pointer"
    :class="
      order.isOpen
        ? 'h-[315px] border-4 border-indigo-600'
        : 'h-[74px] border-2'
    "
    @click="$emit('openOrder', index)"
  >
    <div class="mt-3 ml-2 mr-2">
      <div class="flex justify-between">
        <div
          v-if="noteTooltip"
          class="fixed w-24 h-[18px] bg-gray-800 rounded-md translate-x-[55px] translate-y-[-18px]"
        >
          <p class="text-white text-xs font-medium py-[1px] text-center">
            {{ noteTooltip }}
          </p>
        </div>
        <div class="w-40 flex justify-between">
          <p class="text-sm text-green-600 font-medium">{{ order.id }}</p>
          <img
            class="cursor-pointer mr-1"
            @mousemove="noteTooltip = 'Nhắn tin'"
            @mouseout="noteTooltip = ''"
            src="../assets/icons/chat.svg"
          />
          <div>
            <img
              class="cursor-pointer mr-1"
              @mousemove="noteTooltip = 'Xem đơn(nhanh.vn)'"
              @mouseout="noteTooltip = ''"
              src="../assets/icons/share.svg"
              @click.stop.prevent="gotoNhanh"
            />
          </div>
          <img
            class="cursor-pointer"
            @mousemove="noteTooltip = 'Sửa đơn'"
            @mouseout="noteTooltip = ''"
            src="../assets/icons/order.svg"
            @click="$emit('editOrder', order.id)"
          />
        </div>
        <p class="text-sm text-green-600 font-medium">
          {{ formatCurrency(totalFee) }}
        </p>
      </div>
      <div class="flex justify-between">
        <p
          class="w-[264px] h-6 text-sm text-gray-900 leading-5 whitespace-nowrap overflow-hidden text-ellipsis"
        >
          {{
            order.isOpen
              ? order.customerAddress
              : order.customerAddress?.split(",")?.[0]
          }}
        </p>
        <div
          class="w-24 h-[18px] bg-gray-800 rounded-md translate-y-[80px]"
          :class="tooltip ? 'opacity-100' : 'opacity-0'"
        >
          <p class="text-white text-xs font-medium py-[1px] text-center">
            {{ order.createdByName }}
          </p>
        </div>
      </div>

      <div class="flex justify-between" v-show="order.isOpen">
        <div class="w-24 flex justify-start items-center">
          <img src="../assets/icons/phone.svg" />
          <p class="text-xs leading-4 font-medium text-sky-500 ml-1.5">
            {{ order.customerMobile }}
          </p>
        </div>
        <p class="text-yellow-500 text-xs">{{ order.statusName }}</p>
      </div>
      <div
        class="flex justify-start items-center mt-[5px] w-[147px]"
        v-show="order.isOpen"
      >
        <img src="../assets/icons/handBag.svg" />
        <p class="text-xs leading-4 font-normal text-gray-900 ml-1.5">
          {{ order.products?.[0]?.productName }}
        </p>
        <p class="text-[#000000] font-semibold text-xs ml-1.5">
          {{ formatCurrency(order.calcTotalMoney) }}
        </p>
      </div>
      <div class="flex justify-between mt-[5px]" v-show="order.isOpen">
        <div class="w-44 flex justify-start items-center">
          <img src="../assets/icons/van.svg" />
          <p class="text-xs leading-4 font-normal ml-1.5">
            Ngày nhận:
            {{ formatDay(order.deliveryDate || moment(), "DD/MM/YYYY") }}
          </p>
        </div>
        <p class="text-black text-xs">
          Phí ship: {{ formatCurrency(order.shipFee) }}
        </p>
      </div>
      <div
        class="border-dashed border border-gray-400 mt-2"
        v-show="order.isOpen"
      ></div>
      <div class="flex justify-between mt-2" v-show="order.isOpen">
        <div class="w-1/2 flex justify-start items-center">
          <img src="../assets/icons/clock.svg" />
          <p class="text-xs leading-4 font-normal ml-1.5">
            Tạo lúc: {{ formatDay(order.createdDateTime, "hh:mm - DD/MM") }}
          </p>
        </div>
        <div v-if="order.createdByName" class="flex w-1/2 justify-end">
          <p class="text-black text-xs">Người tạo:</p>
          <img
            @mousemove="tooltip = true"
            @mouseout="tooltip = false"
            class="ml-[5px] w-3 h-3"
            src="../assets/images/avatar.svg"
          />
        </div>
      </div>
      <div class="flex justify-between mt-[5px]" v-show="order.isOpen">
        <div class="w-44 flex justify-start items-center">
          <img src="../assets/icons/note.svg" />
          <p class="text-xs leading-4 font-normal ml-1.5">Ghi chú</p>
        </div>
        <p
          class="text-sky-500 text-xs whitespace-nowrap overflow-hidden text-ellipsis w-2/3 text-right"
        >
          {{ order.description }}
        </p>
      </div>
      <div class="flex justify-between mt-[5px]" v-show="order.isOpen">
        <div class="w-44 flex justify-start items-center">
          <img src="../assets/icons/print.svg" />
          <p class="text-xs leading-4 font-normal ml-1.5">Ghi chú in</p>
        </div>
        <p
          class="text-sky-500 text-xs whitespace-nowrap overflow-hidden text-ellipsis w-2/3 text-right"
        >
          {{ order.privateDescription }}
        </p>
      </div>
      <div
        class="border-dashed border border-gray-400 mt-2"
        v-show="order.isOpen"
      ></div>
      <div
        class="flex justify-between mt-[5px]"
        v-show="order.isOpen && order.tags[0]"
      >
        <div class="w-44 flex justify-start items-center">
          <img src="../assets/icons/tag.svg" />
          <p class="text-xs leading-4 font-normal ml-1.5">Thẻ đơn hàng</p>
        </div>
        <div
          class="flex justify-center items-center bg-purple-100 h-5 w-[75px] rounded-[10px]"
        >
          <p class="text-xs text-violet-800 font-medium">
            {{ order.tags[0] ?? "Thêm thẻ" }}
          </p>
        </div>
      </div>
      <div
        class="flex justify-between mt-[5px]"
        v-show="order.isOpen && order.tags[1]"
      >
        <div class="w-44 flex justify-start items-center">
          <img src="../assets/icons/tag.svg" />
          <p class="text-xs leading-4 font-normal ml-1.5">Thẻ khách hàng</p>
        </div>
        <div
          class="flex justify-center items-center bg-purple-100 h-5 w-[75px] rounded-[10px]"
        >
          <p class="text-xs text-violet-800 font-medium">
            {{ order.tags[1] ?? "Thêm thẻ" }}
          </p>
        </div>
      </div>
      <div
        class="text-sm text-yellow-500 font-medium mt-[3px]"
        v-show="order.isOpen"
      >
        {{ formatCurrency(totalFee) }}
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from "vue";
import { formatDay, formatCurrency } from "@/common/convert";
import moment from "moment";
let tooltip = ref(false);
let noteTooltip = ref("");
const props = defineProps({
  order: Object,
  index: Number,
});
const totalFee = computed(() => {
  const shipFee = +props.order?.shipFee || 0;
  const productFee = props.order?.calcTotalMoney || 0;
  return shipFee + productFee;
});

const gotoNhanh = () => {
  window.open("https://nhanh.vn/order/manage/index");
};
</script>
