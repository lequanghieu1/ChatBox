import { defineStore } from "pinia";

export const useFormBody = defineStore("formBody", {
    state: () => ({
        data: {
          appId: null,
          secretKey: '',
      },
      }),
      actions: {
        saveForm(item) {
          this.data = item
        }
    },
    getters: {
      getBody: (state) => state.data,
    },
});