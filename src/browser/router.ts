import { createRouter, createWebHashHistory } from "vue-router";
import Root from "./views/Root.vue";
import About from "./views/About.vue";

const routes = [
  { path: "/", component: Root },
  { path: "/about", component: About },
  {
    path: "/auth/login",
    component: () => import("./views/auth/Login.vue"),
    name: "login",
  },
  {
    path: "/auth/signin",
    component: () => import("./views/auth/Signin.vue"),
    name: "signin",
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
