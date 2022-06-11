<template>
  <div id="signin-page">
    <TopBarVue title="注册用户" :onback="back" />
    <div class="auth-title">输入您的账号信息，完成账号注册</div>
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
      <van-cell-group inset>
        <van-field
          v-model="form.email"
          name="邮箱"
          placeholder="请输入您的邮箱"
          clearable
          :rules="[
            {
              required: true,
              message: '请输入您的邮箱账号',
            },
            {
              pattern: /^.+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
              message: '邮箱格式有误',
            },
          ]"
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
          :rules="[
            { required: true, message: '请输入密码' },
            {
              pattern: /^\S*(?=\S{8,})(?=\S*\d)(?=\S*[a-z]|[A-Z])\S*$/,
              message: '密码至少8位, 且包含数字、字母',
            },
          ]"
        >
        </van-field>
      </van-cell-group>
      <van-cell-group inset>
        <van-field
          v-model="form.confirmPwd"
          type="password"
          name="确认密码"
          placeholder="确认密码"
          clearable
          :rules="[{ required: true, message: '请再次确认密码' }]"
        >
        </van-field>
      </van-cell-group>
      <div class="auth-btn" @click="signin">注册</div>
    </van-form>
  </div>
</template>
<script setup lang="ts">
import { FormInstance, Toast } from "vant";
import { reactive, ref } from "vue";
import { RpcUtil } from "@malagu/rpc";
import { useRouter } from "vue-router";
import { UserServer } from "../../../common/user-protocol";
import TopBarVue from "../../components/TopBar.vue";

const router = useRouter();

// 表单
let form = reactive({
  username: "",
  email: "",
  password: "",
  confirmPwd: "",
});

const signinFormRef = ref<FormInstance>();
async function signin() {
  console.log(form);

  try {
    for (const key in form) {
      (form as { [x: string]: string })[key] = (
        form as { [x: string]: string }
      )[key].trim();
    }
    await signinFormRef.value?.validate();
  } catch (e: any) {
    return Toast(e[0].message);
  }
  if (form.password !== form.confirmPwd) {
    Toast("请重新确认密码");
    form.confirmPwd = "";
    return;
  }
  Toast.loading({ forbidClick: true });
  let server = RpcUtil.get<UserServer>(UserServer);
  try {
    let signinResult = await server.createUser({
      username: form.username,
      email: form.email,
      password: form.password,
    });
    // Toast.clear();
    if (signinResult.code == 0) {
      Toast.success({
        message: "注册成功",
        forbidClick: true,
        onClose() {
          router.replace({
            name: "login",
          });
        },
      });
    } else {
      Toast(signinResult.msg);
    }
  } catch (error: any) {
    Toast(error?.message);
  }
}

function back() {
  router.back();
}
</script>
<style scoped lang="scss">
@import url(./style.css);
#prototol-wrap {
  transform: scale(0.75);
}
.prototol {
  font-size: 0.9rem;
  color: #a7a7a7;
  margin-left: 6px;
  span {
    color: #0085ff;
  }
}
#isAgree {
  background-color: #fff;
}
.agree-box {
  position: absolute;
  background-color: #f8f8f8;
  width: 100vw;
  height: 100vh;
  overflow-y: scroll;
  padding-bottom: 50px;
}
.AgreementAndObligations {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  width: 100vw;
  margin: auto;
  letter-spacing: 1px;
  text-align: left;
  font-size: 0.7rem;

  img {
    display: block;
    width: 94vw;
    margin: auto;
    margin-bottom: 20px;
  }
  .buy-btn {
    width: 80%;
    height: 46px;
    margin: auto;
    color: #fff;
    line-height: 46px;
    text-align: center;
    background-color: #000;
    margin-bottom: 30px;
    // background: url("https://oss.nftnext.cn/other/buy-btn.png") no-repeat
    //   center/100% 100%;
  }
}
</style>
