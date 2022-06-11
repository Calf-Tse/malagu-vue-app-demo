<template>
  <div
    class="h-top"
    :style="{ color: props.color }"
    :class="{ darkMode: props.darkMode }"
  >
    <div class="h-back-btn flex-cc" @click="back">
      <van-icon size="5.8vw" name="arrow-left" />
    </div>
    <div
      :style="{ color: props.color }"
      :class="{ textCenter: props.textCenter }"
      class="h-top-title"
    >
      {{ props.title }}
    </div>
    <div class="right-icon flex-cc">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
const router = useRouter();
const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  darkMode: {
    type: Boolean,
    default: false,
  },
  textCenter: {
    type: Boolean,
    default: false,
  },
  color: {
    type: String,
    default: "#000",
  },
});

function back() {
  router.back();
}
</script>

<style scoped lang="scss">
.h-top {
  position: relative;
  width: 100vw;
  height: 14.5vw;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .h-back-btn {
    width: 10.7vw;
    height: 100%;
    font-size: 1.5rem;
  }
  .h-top-title {
    flex: 1;
    font-size: 1.3rem;
    text-align: left;
  }
  .textCenter {
    text-align: center;
  }

  .right-icon {
    width: 10.7vw;
    height: 100%;
  }
}
.darkMode {
  text-align: center;
  background-color: #000;
  color: #fff !important;
  .h-top-title {
    text-align: center;
    color: #fff !important;
  }
}
</style>
