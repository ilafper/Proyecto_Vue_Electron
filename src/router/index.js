import { createRouter, createWebHashHistory } from "vue-router";

import LoginView from "../views/loginView.vue";
import HomeView from "../views/home.vue";
import AdminView from "../views/admin.vue";
import registerView from "../views/register.vue";
import EventosAdmin from "../views/eventosAdmin.vue";
import userAdmin from "../views/usersAdmin.vue";
//diferenete srutas de las vistas para redirigir, aaui es donde las pondremos y las usaremos mas adelenate

const routes = [
  {path: "/",redirect: "/login",},{path: "/login",component: LoginView,},
  {path: "/home",component: HomeView,},
  {path: "/admin",component: AdminView,},
  {path: "/register",component: registerView,},
  {path: "/eventosAdmin",component: EventosAdmin,},
  {path: "/usersAdmin",component: userAdmin,},
];



const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
