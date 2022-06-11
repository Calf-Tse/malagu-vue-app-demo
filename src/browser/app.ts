import { createApp } from "vue";
import { App } from "@malagu/vue";
import { router } from "./router";
import Root from "./App.vue";
import Vant from "vant";
import "vant/lib/index.css";

@App(createApp(Root).use(router).use(Vant))
export default class {}
