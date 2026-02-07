import { createRouter, createWebHashHistory } from "vue-router";

import LoginView from "../views/loginView.vue";
import HomeView from "../views/home.vue";
import AdminView from "../views/admin.vue";

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    component: LoginView,
  },
  {
    path: "/home",
    component: HomeView,
  },
  {
    path: "/admin",
    component: AdminView,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
