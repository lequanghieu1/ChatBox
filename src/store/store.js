import { defineStore } from "pinia";

export const useFormBody = defineStore("formBody", {
    state: () => ({
        data: {
        appId: 73006,
        secretKey: 'jlvQvW1hYZPXRiKCVpbIE8VQ9b76fltBlJu184lmGJYrlCCdw9ijnzdiMOSa1Con3f9Pv2f8mBBLOh3rbQwSV5DZSMe9RbmkDh7anGgxX2KxKZBHBbKgtAoI88IGbbNO',
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