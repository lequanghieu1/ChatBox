<template>
  <div class="w-full h-full shadow-md mt-2 border border-gray-200 rounded-md">
    <div class="w-full h-4 bg-gray-200 font-semibold flex justify-around items-center">
      <div class="w-32 text-[8px]">Tên sản phẩm</div>
      <div class="w-6 text-[8px]">SL</div>
      <div class="w-[42px] text-[8px]">Đơn giá</div>
      <div class="w-12 text-[8px]">Thành tiền</div>
    </div>
    <div v-for="item in listProducts" :key="item">
      <div class="w-full h-4 flex justify-around items-center">
        <div class="w-32 text-[9px]">{{ item.productName }}</div>
        <div class="w-6 text-[9px]">{{ item.quantity }}</div>
        <div class="w-[42px] text-[9px]">{{ item.price }}</div>
        <div class="w-12 text-[9px]">{{ total(item) }}</div>
      </div>
    </div>
    <div class="flex justify-between mx-2 my-1">
      <input v-model="search" :disabled="isEdit"
        class="border border-gray-400 rounded-md pl-3 text-xs w-[206px] h-5 placeholder:pl-3 placeholder:text-xs"
        placeholder="Gõ để tìm kiếm sản phẩm" @focus="isHidden = true" @blur="closePopup" />
      <div class="flex justify-center items-center bg-purple-100 h-5 w-[70px] rounded-[10px]">
        <p class="text-xs text-violet-800 font-medium cursor-pointer" @click="filterListProduct">Tìm
          kiếm</p>
      </div>
    </div>
    <div class="w-56 h-full flex items-center flex-col justify-center rounded-md shadow-lg bg-white cursor-pointer"
      v-if="isHidden">
      <div class="flex items-center justify-between w-11/12" v-for="item in search ? listProductFilter : list"
        :key="item.idNhanh">
        <div class="w-2/3 flex items-center justify-start mt-2" @click="handleChoose(item)">
          <img v-if="!item.image" class="h-3 w-3" src="../assets/images/default.jpg" />
          <img v-else class="h-3 w-3" :src="item.image" />
          <p class="text-sm ml-2 text-gray-700">{{ item.name }}</p>
        </div>
        <p class="text-black font-semibold text-xs">{{ formatCurrency(item.price) }}</p>
      </div>
    </div>
  </div>
</template>
<script setup>
import { formatCurrency } from '@/common/convert';
import { ref } from 'vue'
import { HTTP } from "../common/api";
import { useFormBody } from "../store/store";
import { convertObject } from "../common/convert";
const store = useFormBody();

let isHidden = ref(false)
let search = ref('')
let listProducts = ref([])
let listProductFilter = ref([])
const props = defineProps({
  product: Array,
  list: Array,
  isEdit: Boolean
})
const emit = defineEmits(['addProduct'])
const total = (obj) => {
  return obj.price * obj.quantity || 0
};
listProducts.value = structuredClone(props.product) || []

const handleChoose = (item) => {
  const tempIndex = listProducts.value.findIndex((e) => e.productName === item.name)
  if (!item.remain) {
    return emit('outStock', item.name);
  } else {
    if (tempIndex >= 0) {
      listProducts.value[tempIndex].quantity++
      item.remain--
    }
    else {
      const product = { ...item, idNhanh: item.idNhanh, productName: item.name, quantity: 1, price: item.price }
      listProducts.value.push(product)
      item.remain--
    }
  }
  emit('addProduct', listProducts.value);
  closePopup()
}
const closePopup = () => {
  setTimeout(() => {
    isHidden.value = false
  }, 100)
}
const filterListProduct = async () => {
  if (!search.value) return
  const temp = structuredClone(store.getBody);
  temp.accessToken = sessionStorage.getItem('token')
  delete temp.data
  const res = await HTTP("product/search", temp, { name: search.value });
  listProductFilter.value = convertObject(res.data?.data?.data?.products) || []
  isHidden.value = true
}
</script>
