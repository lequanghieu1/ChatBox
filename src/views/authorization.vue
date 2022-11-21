<template>
  <load />
</template>
<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { initSdkApp } from "../common/sdkMethods.js";
import { useFormBody } from "../store/store";
import load from "../components/load.vue";
const router = useRouter();
const store = useFormBody();
const check = ref(false);

onMounted(async () => {
  localStorage.setItem("token-chat-box", location.search.replace("?", ""));
  if (Object.keys(JSON.parse(localStorage.getItem("infoApp")) || {}).length) {
    store.saveForm(JSON.parse(localStorage.getItem("infoApp")));
    check.value = true;
  }
  await initSdkApp();
  await getProfile();
  await getConfig();
});

const getConfig = () => {
  Sdk.getConfig(
    {
      type_config: "CRM",
      brand_name: "nhanh.vn",
    },
    async (e, r) => {
      if (r?.data?.config_data?.token) {
        sessionStorage.setItem("token", r?.data?.config_data?.token);
        if (!check.value) {
          store.saveForm(r.data.config_data);
        }
        router.push("/orders");
      } else {
        router.push("/getToken");
      }
    }
  );
};

const getProfile = () => {
  Sdk.getCustomerInfo((e, r) => {
    store.saveProfile({
      ...r.data.public_profile,
      phone: r.data.conversation_contact?.client_phone || "",
    });
  });
};
</script>
