<template>
    <loading />
</template>
<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { initSdkApp } from "../common/sdkMethods.js";
import { useFormBody } from "../store/store";
import loading from "../components/loading.vue";
const router = useRouter();
const store = useFormBody();

onMounted(async () => {
    localStorage.setItem("token-chat-box", location.search.replace("?", ""));
    if (Object.keys(JSON.parse(localStorage.getItem('infoApp')) || {}).length) {
        store.saveForm(JSON.parse(localStorage.getItem('infoApp')))
    }
    await initSdkApp();
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
                router.push("/orders");
            } else {
                router.push("/getToken");
            }
        }
    );
};

</script>
