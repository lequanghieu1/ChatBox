import { defineStore } from "pinia";

export const useFormBody = defineStore("formBody", {
  state: () => ({
    data: {
      appId: null,
      secretKey: '',
    },
    profile: {},
  }),
  actions: {
    saveForm(item) {
      this.data = item
    },
    saveProfile(item) {
      this.profile = item
    }
  },
  
  getters: {
    getBody: (state) => state.data,
    getProfile: (state) => state.profile,
  },
});