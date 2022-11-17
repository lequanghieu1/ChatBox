<template>
  <div class="w-full p-1 text-sm text-white absolute z-10 translate-y-[-57px]" v-if="alert">
    <div class="bg-gray-500 p-4">
      <div class="flex justify-around items-start">
        <img src="../assets/icons/warning.svg" />
        <div>
          <p>Đã hết sản phẩm</p>
          <p class="mt-1">Sản phẩm {{ productAlert }} đã hết hàng</p>
        </div>
        <img src="../assets/icons/close.svg" @click="alert = false" />
      </div>
      <div class="flex justify-around items-start">
      </div>
    </div>
  </div>
  <div class="w-full h-full">
    <div class="mx-[11px] my-[17px]">
      <div class="flex justify-between space-x-2.5">
        <input class="border border-gray-400 pl-3 h-5 rounded-md text-xs w-1/2 placeholder:pl-3 placeholder:text-xs"
          placeholder="Họ Tên" v-model="objEdit.customerName" :disabled="isEdit" />
        <input class="border border-gray-400 rounded-md h-5 text-xs pl-3 w-1/2 placeholder:pl-3 placeholder:text-xs"
          :disabled="isEdit" placeholder="Số Điện Thoại" v-model="objEdit.customerMobile" @input="numberValidate" />
      </div>
      <div class="flex justify-between space-x-2.5 mt-2">
        <input v-model="objEdit.customerAddress" :disabled="isEdit"
          class="border border-gray-400 rounded-md h-5 text-xs pl-3 w-full placeholder:pl-3 placeholder:text-xs"
          placeholder="Địa chỉ" />
      </div>
      <div class="flex justify-between space-x-2.5 mt-2">
        <select id="countries" v-model="objEdit.customerCityId" @change="chooseCity" :disabled="isEdit"
          class="border border-gray-400 rounded-md w-1/3 placeholder:pl-1.5 text-xs h-6">
          <option selected>Tỉnh</option>
          <template v-for="city in cities" :key="city.value">
            <option :value="city.value">{{ city.text }}</option>
          </template>
        </select>
        <select id="district" v-model="objEdit.customerDistrictId" @change="chooseDistrict"
          :disabled="!districts.length || isEdit"
          class="border border-gray-400 rounded-md w-1/3 placeholder:pl-1.5 text-xs h-6">
          <option selected>Quận huyện</option>
          <template v-for="district in districts" :key="district.value">
            <option :value="district.value">{{ district.text }}</option>
          </template>
        </select>
        <select id="ward" v-model="objEdit.customerWard"
          class="border border-gray-400 rounded-md w-1/3 placeholder:pl-1.5 text-xs h-6"
          :disabled="!wards.length || isEdit">
          <option selected>Phường xã</option>
          <template v-for="ward in wards" :key="ward.value">
            <option :value="ward.text">{{ ward.text }}</option>
          </template>
        </select>
      </div>
      <div class="border-dashed border border-gray-400 mt-2"></div>
      <div class="flex justify-between mt-2">
        <div class="w-28 text-xs text-gray-500">Thông tin đơn hàng</div>
        <div class="flex justify-start items-center">
          <p>Kho:</p>
          <select id="countries" v-model="objEdit.depotId" :disabled="isEdit" @change="chooseWarehouse"
            class="border border-gray-400 rounded-md w-20 placeholder:pl-1.5 text-xs h-6 ml-1">
            <option selected>Kho</option>
            <template v-for="warehouse in warehouses" :key="warehouse.value">
              <option :value="warehouse.value">{{ warehouse.text }}</option>
            </template>
          </select>
        </div>
      </div>
      <Table :product="objEdit.products" :list="products" @add-product="updateList" :isEdit="isEdit"
        @outStock="outStock" />
      <div class="flex justify-between space-x-2.5 mt-2">
        <input class="border border-gray-400 rounded-md w-1/2 h-5 text-xs pl-3 placeholder:pl-3 placeholder:text-xs"
          placeholder="Ghi chú" v-model="objEdit.description" />
        <input class="border border-gray-400 rounded-md w-1/2 h-5 text-xs pl-3 placeholder:pl-3 placeholder:text-xs"
          placeholder="Ghi chú in" v-model="objEdit.privateDescription" />
      </div>
      <div class="flex justify-between mt-2">
        <div class="w-44 flex justify-start items-center">
          <img src="../assets/icons/tag.svg" />
          <p class="text-xs leading-4 font-normal ml-1.5">Thẻ đơn hàng</p>
        </div>
        <div class="flex justify-center items-center bg-purple-100 h-5 w-[75px] rounded-[10px]">
          <p class="text-xs text-violet-800 font-medium">Thêm thẻ</p>
        </div>
      </div>
      <div class="flex justify-between mt-2">
        <div class="w-44 flex justify-start items-center">
          <img src="../assets/icons/tag.svg" />
          <p class="text-xs leading-4 font-normal ml-1.5">Thẻ khách hàng</p>
        </div>
        <div class="flex justify-center items-center bg-purple-100 h-5 w-[75px] rounded-[10px]">
          <p class="text-xs text-violet-800 font-medium">Thêm thẻ</p>
        </div>
      </div>
      <div class="border-dashed border border-gray-400 mt-2"></div>
      <div class="flex justify-between mt-2">
        <div class="text-xs">Tổng tiền chi tiêu của khách</div>
        <p class="text-black text-xs font-semibold">
          {{ formatCurrency(objEdit.calcTotalMoney || 0) }}
        </p>
      </div>
      <div class="flex justify-between mt-2">
        <div class="text-xs">Tạo lúc</div>
        <p class="text-black text-xs">
          {{ formatDay(objEdit.createdDateTime, "hh:mm - DD/MM") }}
        </p>
      </div>
      <div class="flex justify-between mt-2">
        <div class="text-xs">Tổng khối lượng</div>
        <p class="text-black text-xs">{{ objEdit.shippingWeight || 0 }}g</p>
      </div>
      <div class="flex justify-between mt-2">
        <div class="text-xs">Người tạo</div>
        <div class="flex w-1/2 justify-end">
          <img v-if="objEdit.createdByName" class="ml-[5px]" src="../assets/images/avatar.svg" />
          <p class="text-black text-xs ml-1">{{ objEdit.createdByName }}</p>
        </div>
      </div>
      <div class="flex justify-between mt-[5px]">
        <div class="text-xs">Dự kiến nhận hàng</div>
        <input class="text-sky-500 text-xs border border-gray-400 rounded-md" type="date" v-model="objEdit.deliveryDate"
          :disabled="isEdit" :min="moment().format('YYYY-MM-DD')" max="2023-12-31">
      </div>
      <div class="flex justify-between mt-2">
        <div class="w-28 text-xs">Hãng vận chuyển</div>
        <div class="flex justify-start items-center">
          <option selected></option>
          <select id="countries" @change="chooseCarrier" v-bind:disabled="!shipList.length || isEdit"
            class="border border-gray-400 rounded-md w-32 placeholder:pl-1.5 text-xs h-6 ml-1">
            <template v-for="ship in shipList" :key="ship.value">
              <option :value="ship.value">{{ ship.text }}</option>
            </template>
          </select>
        </div>
      </div>
      <div class="border-dashed border border-gray-400 mt-2"></div>
      <div class="flex justify-between items-center mt-[5px]">
        <div class="text-xs">Phí vận chuyển</div>
        <input class="border border-gray-400 rounded-md w-1/2 h-5 text-xs pl-3 placeholder:pl-3 placeholder:text-xs"
          disabled placeholder="0đ" v-model="objEdit.shipFee" />
      </div>
      <div class="flex justify-between items-center mt-[5px]">
        <div class="text-xs">Giảm giá</div>
        <input class="border border-gray-400 rounded-md w-1/2 pl-3 h-5 text-xs placeholder:pl-3 placeholder:text-xs"
          disabled placeholder="0đ" />
      </div>
      <div class="flex justify-between items-center mt-2">
        <div class="text-sm font-semibold">Thành tiền</div>
        <p class="text-sm font-semibold text-red-500">{{ formatCurrency(totalFee)
        }}</p>
      </div>
      <button v-if="!router.currentRoute.value.query.orderId" @click="createOrder"
        class="bg-indigo-600 w-full rounded-md h-8 text-white text-base mt-2">
        Tạo đơn
      </button>
      <button v-else class="bg-blue-500 w-full rounded-md h-8 text-white text-base mt-2" @click="editOrder">
        Cập nhật
      </button>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted, watch } from "vue";
import Table from "../components/tableOrder.vue";
import { useRouter } from "vue-router";
import { formatDay, formatCurrency, numberOnly } from "@/common/convert";
import { convertObject } from "../common/convert";
import { HTTP } from "../common/api";
import { useFormBody } from "../store/store";
import moment from "moment";

const router = useRouter();
const store = useFormBody();

const emit = defineEmits(['afterUpdate'])
let cities = ref([]);
let districts = ref([]);
let wards = ref([]);
let warehouses = ref([]);
let products = ref([]);
let shipList = ref([]);
let alert = ref(false)
let productAlert = ref('')
const props = defineProps({
  info: Object,
  isEdit: Boolean,
});
let objEdit = ref({});

onMounted(async () => {
  cities.value = await createSelect("shipping/location", "province");
  warehouses.value = await createSelect("store/depot", "warehouse");
  products.value = await createSelect("product/search", "product", true)
  products.value = products.value.map((e) => {
    return {
      ...e,
      remain: e.inventory.remain || 0
    }
  });
  objEdit.value.deliveryDate = formatDay(moment(), 'YYYY-MM-DD')
});

watch(
  [objEdit],
  async () => {
    if (objEdit.value.depotId) {
      products.value = products.value.map((e) => {
        return {
          ...e,
          remain: e.inventory.depots[props.depotId].remain || 0
        }
      })
    }
    const objShip = {
      fromCityName: "Hà Nội",
      fromDistrictName: "Quận Ba Đình",
      toCityName: findAddress(cities.value, objEdit.value.customerCityId),
      toDistrictName: findAddress(
        districts.value,
        objEdit.value.customerDistrictId
      ),
      shippingWeight: objEdit.value.shippingWeight || 1,
    };
    const temp = structuredClone(store.getBody);
    temp.accessToken = sessionStorage.getItem('token')
    const res = await HTTP("shipping/fee", temp, objShip);
    if (res?.data?.data?.data) {
      shipList.value = res?.data?.data?.data?.map((e) => {
        return {
          text: `${e.carrierName} - ${e.serviceTypeName}`,
          value: `${e.carrierId},${e.serviceId},${e.shipFee}`,
        }
      })
    }
  }, {
  deep: true
}
);

const getList = async (url, type, id, notConvert) => {
  let result = [];
  let data = {}
  const temp = structuredClone(store.getBody);
  temp.accessToken = sessionStorage.getItem('token')
  if (type && id) {
    delete temp.data
    data = { type, parentId: id }
  }
  const response = await HTTP(url, temp, data);
  if (!Array.isArray(response.data?.data?.data) && !notConvert) {
    result = convertObject(response.data?.data?.data) || [];
  } else if (!Array.isArray(response.data?.data?.data) && notConvert) {
    result = convertObject(response.data?.data?.data?.products) || [];
  } else {
    result = response.data?.data?.data || [];
  }
  return notConvert
    ? result
    : result.map(e => {
      return {
        value: e.id,
        text: e.name,
      };
    });
};
const chooseCity = async setting => {
  const response = await getList(
    "shipping/location",
    "DISTRICT",
    objEdit.value.customerCityId
  );
  districts.value = response;
  if (setting) {
    objEdit.value.customerDistrictId = "Quận huyện";
  }
};

const chooseWarehouse = async value => {
  console.log(value)
};

const chooseDistrict = async setting => {
  const response = await getList(
    "shipping/location",
    "WARD",
    objEdit.value.customerDistrictId
  );
  wards.value = response;
  if (setting) {
    objEdit.value.customerWard = "Phường xã";
  }
};
if (props.isEdit) {
  objEdit.value = structuredClone(props.info);
  chooseCity(false);
  chooseDistrict(false);
} else {
  objEdit.value.customerCityId = "Tỉnh";
  objEdit.value.customerDistrictId = "Quận huyện";
  objEdit.value.customerWard = "Phường xã";
  objEdit.value.depotName = "Kho";
}

const findAddress = (arr, id) => {
  return arr.find(e => e.value === id)?.text ?? null;
};
const chooseCarrier = (e) => {
  const data = e.target.value.split(',')
  objEdit.value.carrierId = data[0]
  objEdit.value.carrierServiceId = data[1]
  objEdit.value.shipFee = data[2]
}

const createSelect = async (url, nameStore, notConvert = false) => {
  if (localStorage.getItem(nameStore)) {
    return JSON.parse(localStorage.getItem(nameStore));
  }
  const response = await getList(url, null, null, notConvert);
  localStorage.setItem(nameStore, JSON.stringify(response));
  return response;
};

const updateList = val => {
  objEdit.value.products = val.map(e => {
    return {
      ...e,
      id: e.idNhanh,
      name: e.productName,
    };
  });
  objEdit.value.calcTotalMoney = objEdit.value.products.reduce((pre, e) => {
    return pre + e.quantity * e.price;
  }, 0);
  objEdit.value.shippingWeight = objEdit.value.products.reduce((pre, e) => {
    return pre + +e.shippingWeight || 0;
  }, 0);
};

const outStock = (value) => {
  alert.value = true;
  // setTimeout(() => {
  //   productAlert.value = value
  //   alert.value = false
  // }, 5000)
}

const createOrder = async () => {
  const id = (Math.random() * 1000000).toString().split(".")[0];
  objEdit.value.customerCityName = findAddress(
    cities.value,
    objEdit.value.customerCityId
  );
  objEdit.value.customerDistrictName = findAddress(
    districts.value,
    objEdit.value.customerDistrictId
  );
  objEdit.value.id = id;
  objEdit.value.productList = objEdit.value.products;
  const temp = structuredClone(store.getBody);
  temp.accessToken = sessionStorage.getItem('token')
  delete temp.data
  const res = await HTTP("order/add", temp, structuredClone(objEdit.value));
  if (res.data.data.code) {
    emit('afterUpdate');
  }
};

const totalFee = computed(() => {
  const shipFee = +objEdit.value.shipFee || 0
  const productFee = objEdit.value.calcTotalMoney || 0
  return shipFee + productFee
});

const numberValidate = () => {
  objEdit.value.customerMobile = numberOnly(objEdit.value.customerMobile)
}

const editOrder = async () => {
  const temp = structuredClone(store.getBody);
  temp.accessToken = sessionStorage.getItem('token')
  delete temp.data
  const { description, privateDescription, id } = objEdit.value
  const res = await HTTP("order/update", temp, { description, privateDescription, orderId: id });
  if (res.data.data.code) {
    emit('afterUpdate');
  }
}
</script>
