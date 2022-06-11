<template>
  <div id="login-page">
    <TopBarVue title="登录" />
    <div class="auth-title">输入您的账号信息，完成登录</div>
    <div class="login-form-wrap">
      <van-form ref="loginFormRef">
        <van-cell-group inset>
          <van-field
            v-model="form.username"
            name="用户名"
            placeholder="请输入您的 用户名/邮箱"
            clearable
            :rules="[{ required: true, message: '请填写用户名/邮箱' }]"
          >
          </van-field>
        </van-cell-group>
        <van-cell-group inset>
          <van-field
            v-model="form.password"
            type="password"
            name="密码"
            placeholder="请输入密码"
            clearable
            :rules="[{ required: true, message: '请输入密码' }]"
          >
          </van-field>
        </van-cell-group>
        <div class="auth-btn" @click="login">登录</div>
        <!-- <router-link id="forget-password" to="/auth/forgetPassword" tag=""
          >忘记密码</router-link
        > -->
      </van-form>
      <div id="register">
        没有账号?
        <span @click="toSignin" style="text-decoration: underline; color: blue"
          >立刻注册</span
        >
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive } from "vue";
import { ref } from "vue";
import axios from "axios";
import { Toast, FormInstance } from "vant";
// import { useHideTabbar } from "../../../utils/hideTabbar";
import { useRouter } from "vue-router";
import TopBarVue from "../../components/TopBar.vue";

// useHideTabbar();

const router = useRouter();

let isPullnew = ref(false);
const myQuery = router.currentRoute.value.query;
if (Object.keys(myQuery).length != 0) {
  if (myQuery.pullnew) {
    isPullnew.value = true;
  }
}

let form = reactive({
  username: "",
  password: "",
});
const loginFormRef = ref<FormInstance>();
async function login() {
  try {
    for (const key in form) {
      (form as { [x: string]: string })[key] = (
        form as { [x: string]: string }
      )[key].trim();
    }
    await loginFormRef.value?.validate();
  } catch (e: any) {
    return Toast(e[0].message);
  }
  // 调用接口提交数据
  try {
    Toast.loading({ mask: true });
    let { data: loginResult } = await axios.post("./login", form, {
      headers: { "X-Requested-With": "XMLHttpRequest" },
    });
    Toast.clear();
    console.log("loginResult:", loginResult);
    if (loginResult.authenticated === true) {
      router.back();
    }
  } catch (err: any) {
    console.log(err.response.data);
    Toast(err.response.data);
  }
}

if (router.currentRoute.value.query.username) {
  form.username = router.currentRoute.value.query.username as string;
  form.password = router.currentRoute.value.query.pwd as string;
  login();
}

function toSignin() {
  router.push({
    path: "/auth/signin",
  });
}

// const delta = router.currentRoute.value.hash.includes("#/personal") ? -2 : -1;
</script>
<style scoped lang="scss">
@import url(./style.css);
.other-auth-contain::before {
  content: "";
  display: block;
  width: 90%;
  margin: 0 auto;
  position: absolute;
  top: -30%;
  border-top: 1px solid rgba(167, 167, 167, 0.302);
}
.other-auth-contain::after {
  content: "或";
  display: block;
  position: absolute;
  top: calc(-30% - 0.65em);
  left: 0;
  right: 0;
  margin: auto;
  width: 3em;
  color: #cccccc;
  font-size: 0.8rem;
  background-color: #f8f8f8;
}
#forget-password {
  font-size: 0.9rem;
  color: #000;
  text-decoration: underline;
}
#register {
  position: absolute;
  bottom: 4%;
  left: 0;
  right: 0;
  margin: auto;
  font-size: 0.9rem;
  color: #000;
  #register-acount {
    color: #0085ff;
    text-decoration: underline;
    font-weight: 500;
  }
}
</style>
