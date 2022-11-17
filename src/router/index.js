import { createWebHistory, createRouter } from "vue-router";
import Authorization from "@/views/authorization.vue";

const routes = [
  {
    path: "/orders",
    name: "Order",
    component: () => import('../views/listOrders.vue'),
  },
  {
    path: "/auth",
    name: "Auth",
    component: Authorization,
  },
  {
    path: "/getToken",
    name: "getToken",
    component: () => import('../views/auth.vue'),
  },
  {
    path: "/",
    name: "oAuth",
    component: () => import('../views/oAuth.vue'),
  },
  {
    path: "/access",
    name: "Access",
    component: () => import('../views/access.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// router.beforeEach((to, from, next) => {
//   if (!sessionStorage.getItem('token')) next({ path: '/auth' })
//   else next()
// })

export default router;