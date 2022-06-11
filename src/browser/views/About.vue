<template>
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </div>
  <div id="about">
    <h1>This is an about page</h1>
    <van-form ref="signinFormRef" class="login-form-wrap">
      <van-cell-group inset>
        <van-field
          v-model="form.username"
          name="用户名"
          placeholder="请输入您的用户名"
          clearable
          :rules="[{ required: true, message: '请填写用户名' }]"
        >
        </van-field>
      </van-cell-group>
      <div class="auth-btn" @click="submit">获取用户信息</div>
      <div class="auth-btn" @click="deleteUser">删除此用户</div>
    </van-form>
    <pre style="text-align: left">
      用户名：{{ userMsg.username }}
      邮箱：{{ userMsg.email }}
      注册时间：{{ userMsg.create_time }}
      是否已删除：{{
        userMsg.is_delete === undefined ? "" : userMsg.is_delete ? "是" : "否"
      }}
    </pre>
  </div>
</template>
<script lang="ts" setup>
import { reactive } from "vue";
import { RpcUtil } from "@malagu/rpc";
import { UserServer } from "../../common/user-protocol";
import { Toast } from "vant";
import { useRouter } from "vue-router";

const router = useRouter();

const form = reactive({
  username: "",
});
const userMsg = reactive({
  id: "",
  username: "",
  email: "",
  create_time: "",
  is_delete: undefined,
});
const getServer = () => RpcUtil.get<UserServer>(UserServer);
const submit = async () => {
  if (!form.username) return Toast("请输入用户名");
  Toast.loading({ forbidClick: true });
  const result = await getServer().getUser(form.username);
  console.log(result);
  Toast.clear();
  if (result.code == 0) {
    Object.assign(userMsg, result.data);
    userMsg.create_time = new Date(
      +userMsg.create_time * 1000
    ).toLocaleString();
  } else {
    Toast("请先登录");
    router.push("/auth/login");
  }
};
const deleteUser = async () => {
  if (!userMsg.id) return;
  const result = await getServer().deleteUser(userMsg.id);
  if (result.code == 0) {
    Toast.success("删除成功");
  }
};
</script>
<style lang="css" scoped>
@import url("auth/style.css");
</style>
